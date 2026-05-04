import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubscribePayload {
  email?: string;
  list?: string;
  /** Honeypot — if present, silently accept and discard. */
  website?: string;
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

  const list = (body.list ?? 'general').trim().slice(0, 64) || 'general';

  const apiKey = import.meta.env.RESEND_API_KEY;
  const audienceId = import.meta.env.RESEND_AUDIENCE_ID;
  const fromEmail = import.meta.env.RESEND_FROM_EMAIL;
  const notifyTo = import.meta.env.CONTACT_TO_EMAIL;

  if (!apiKey || !audienceId) {
    console.error('Subscribe: missing RESEND_API_KEY or RESEND_AUDIENCE_ID');
    return jsonError(500, 'Email signup is temporarily unavailable.');
  }

  const resend = new Resend(apiKey);
  let alreadyExisted = false;

  try {
    const result = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });

    if (result.error) {
      const message = result.error.message?.toLowerCase() ?? '';
      // Treat "already exists" as success — idempotent UX.
      if (message.includes('already exists') || message.includes('already in')) {
        alreadyExisted = true;
      } else {
        console.error('Subscribe: Resend error', result.error);
        return jsonError(500, 'Could not subscribe. Please try again later.');
      }
    }
  } catch (err) {
    console.error('Subscribe: unexpected error', err);
    return jsonError(500, 'Could not subscribe. Please try again later.');
  }

  // Notify the operator about the new subscriber. Best-effort: a notification
  // failure must not fail the subscribe (the user already added themselves to
  // the list successfully).
  if (!alreadyExisted && fromEmail && notifyTo) {
    try {
      await resend.emails.send({
        from: fromEmail,
        to: [notifyTo],
        subject: `New email subscriber (${list}): ${email}`,
        text:
          `A new email subscribed to the "${list}" list.\n\n` +
          `Email: ${email}\n` +
          `List: ${list}\n` +
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
