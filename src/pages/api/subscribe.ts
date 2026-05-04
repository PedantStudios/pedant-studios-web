import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_LISTS = ['general', 'webcenter'] as const;
type ListName = (typeof ALLOWED_LISTS)[number];

interface SubscribePayload {
  email?: string;
  list?: string;
  /** Honeypot — if present, silently accept and discard. */
  website?: string;
}

/**
 * Map a list name to the configured Resend Topic ID. Topics are Resend's
 * recipient-controlled subscription model: contacts opt in or opt out of each
 * topic independently, and Resend's unsubscribe page surfaces these to
 * recipients automatically. (Audiences are deprecated as of Resend SDK 6.x.)
 */
function getTopicId(list: ListName): string | undefined {
  const env = import.meta.env;
  switch (list) {
    case 'webcenter':
      return env.RESEND_TOPIC_ID_WEBCENTER;
    case 'general':
    default:
      return env.RESEND_TOPIC_ID_GENERAL;
  }
}

export const POST: APIRoute = async ({ request }) => {
  let body: SubscribePayload;
  try {
    body = (await request.json()) as SubscribePayload;
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  // Honeypot — silently succeed but do nothing.
  if (body.website && body.website.trim() !== '') {
    return jsonOk();
  }

  const email = body.email?.trim().toLowerCase() ?? '';
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return jsonError(400, 'Please enter a valid email address.');
  }

  const rawList = (body.list ?? 'general').trim();
  const list: ListName = (ALLOWED_LISTS as readonly string[]).includes(rawList)
    ? (rawList as ListName)
    : 'general';

  const apiKey = import.meta.env.RESEND_API_KEY;
  const topicId = getTopicId(list);
  const fromEmail = import.meta.env.RESEND_FROM_EMAIL;
  const notifyTo = import.meta.env.CONTACT_TO_EMAIL;

  if (!apiKey || !topicId) {
    console.error(`Subscribe: missing RESEND_API_KEY or topic for list "${list}"`);
    return jsonError(500, 'Email signup is temporarily unavailable.');
  }

  const resend = new Resend(apiKey);
  const topics = [{ id: topicId, subscription: 'opt_in' as const }];
  let alreadyExisted = false;

  try {
    const result = await resend.contacts.create({ email, topics });

    if (result.error) {
      const message = result.error.message?.toLowerCase() ?? '';
      const isAlreadyExists =
        message.includes('already exists') || message.includes('already in');

      if (!isAlreadyExists) {
        console.error('Subscribe: Resend error', result.error);
        return jsonError(500, 'Could not subscribe. Please try again later.');
      }

      // Contact already exists — patch their topic subscriptions so they get
      // opted into this topic. The PATCH endpoint accepts email as identifier.
      alreadyExisted = true;
      const updateResult = await resend.contacts.topics.update({ email, topics });
      if (updateResult.error) {
        // Non-fatal: the contact is on the system; we just couldn't add the
        // topic for them. Log and continue with success — they can manually
        // opt in via the Resend-hosted preferences page on any email we send.
        console.error(
          'Subscribe: topic update failed for existing contact (non-fatal)',
          updateResult.error,
        );
      }
    }
  } catch (err) {
    console.error('Subscribe: unexpected error', err);
    return jsonError(500, 'Could not subscribe. Please try again later.');
  }

  // Notify operator about the new subscriber. Only on NEW contacts to avoid
  // spamming the operator with duplicates from form re-submissions. Best-
  // effort: a notification failure must not fail the subscribe itself.
  if (!alreadyExisted && fromEmail && notifyTo) {
    try {
      await resend.emails.send({
        from: fromEmail,
        to: [notifyTo],
        subject: `New email subscriber (${list}): ${email}`,
        text:
          `A new email subscribed to the "${list}" topic.\n\n` +
          `Email: ${email}\n` +
          `Topic: ${list}\n` +
          `Time: ${new Date().toISOString()}\n`,
      });
    } catch (err) {
      console.error('Subscribe: notification send failed (non-fatal)', err);
    }
  }

  return jsonOk();
};

function jsonOk() {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function jsonError(status: number, error: string) {
  return new Response(JSON.stringify({ success: false, error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
