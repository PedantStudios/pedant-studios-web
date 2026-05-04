import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPayload {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
  /** Honeypot — if present, silently accept and discard. */
  website?: string;
}

const ALLOWED_TOPICS = new Set(['general', 'webcenter', 'partnership', 'press', 'other']);

export const POST: APIRoute = async ({ request }) => {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  // Honeypot — silently succeed but do nothing.
  if (body.website && body.website.trim() !== '') {
    return jsonOk();
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim().toLowerCase();
  const topic = (body.topic ?? 'general').trim();
  const message = (body.message ?? '').trim();

  if (!name || name.length > 200) {
    return jsonError(400, 'Please enter your name.');
  }
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return jsonError(400, 'Please enter a valid email address.');
  }
  if (!ALLOWED_TOPICS.has(topic)) {
    return jsonError(400, 'Invalid topic.');
  }
  if (!message || message.length < 10 || message.length > 5000) {
    return jsonError(400, 'Please enter a message between 10 and 5000 characters.');
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const fromEmail = import.meta.env.RESEND_FROM_EMAIL;
  const toEmail = import.meta.env.CONTACT_TO_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    console.error('Contact: missing RESEND_API_KEY, RESEND_FROM_EMAIL, or CONTACT_TO_EMAIL');
    return jsonError(500, 'The contact form is temporarily unavailable.');
  }

  const resend = new Resend(apiKey);

  const subject = `[${topic}] Contact form: ${name}`;

  // Plain-text body — readable in any email client.
  const text =
    `New contact form submission\n\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Topic: ${topic}\n\n` +
    `Message:\n${message}\n`;

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject,
      text,
    });

    if (result.error) {
      console.error('Contact: Resend error', result.error);
      return jsonError(500, 'Could not send. Please try again later.');
    }

    return jsonOk();
  } catch (err) {
    console.error('Contact: unexpected error', err);
    return jsonError(500, 'Could not send. Please try again later.');
  }
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
