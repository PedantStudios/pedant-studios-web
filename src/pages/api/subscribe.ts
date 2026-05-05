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
 * Build the topics array for a new contact. Both forms (homepage and
 * WebCenter) opt the user into BOTH topics — General Pedant Studios updates
 * AND WebCenter updates. Recipients can unsubscribe from either topic
 * independently via the Resend-hosted preferences page on any email we send.
 *
 * The `list` parameter from the form is preserved only as metadata in the
 * operator notification (so we can see which form a signup came from), not
 * for routing.
 */
function buildTopics(): { id: string; subscription: 'opt_in' }[] {
  const env = import.meta.env;
  const topics: { id: string; subscription: 'opt_in' }[] = [];
  if (env.RESEND_TOPIC_ID_GENERAL) {
    topics.push({ id: env.RESEND_TOPIC_ID_GENERAL, subscription: 'opt_in' });
  }
  if (env.RESEND_TOPIC_ID_WEBCENTER) {
    topics.push({ id: env.RESEND_TOPIC_ID_WEBCENTER, subscription: 'opt_in' });
  }
  return topics;
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
  const topics = buildTopics();
  const fromEmail = import.meta.env.RESEND_FROM_EMAIL;
  const notifyTo = import.meta.env.CONTACT_TO_EMAIL;

  if (!apiKey || topics.length === 0) {
    console.error('Subscribe: missing RESEND_API_KEY or no Topic IDs configured');
    return jsonError(500, 'Email signup is temporarily unavailable.');
  }

  const resend = new Resend(apiKey);
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
        subject: `New email subscriber (${list} form): ${email}`,
        text:
          `A new email signed up via the "${list}" form.\n\n` +
          `Email: ${email}\n` +
          `Source form: ${list}\n` +
          `Topics opted-in: ${topics.length} (general + webcenter)\n` +
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
