import type { ContactMessage } from '@portfolio/shared';

/**
 * Sends the contact form's messages. Abstracted so the router can be tested
 * without a network call, and so the transport can change without touching
 * the route.
 */
export interface Mailer {
  send(message: ContactMessage): Promise<void>;
}

export interface ResendMailerOptions {
  apiKey: string;
  /** Verified sender on the Resend account, e.g. `contact@alexandregiraud.tech`. */
  from: string;
  /** Where the message lands — the site owner's inbox. */
  to: string;
  /** Injectable for tests. */
  fetchImpl?: typeof fetch;
}

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Resend transport over its REST API — no SDK needed for a single endpoint,
 * matching how this codebase already talks to the OAuth providers by hand.
 *
 * The visitor's address goes in `reply_to`, never in `from`: sending as a
 * domain we do not control would fail SPF/DKIM and land in spam.
 */
export function createResendMailer(options: ResendMailerOptions): Mailer {
  const doFetch = options.fetchImpl ?? fetch;

  return {
    async send(message) {
      const response = await doFetch(RESEND_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${options.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: options.from,
          to: [options.to],
          reply_to: message.email,
          subject: `Portfolio — message de ${message.name}`,
          text: [`Nom    : ${message.name}`, `E-mail : ${message.email}`, '', message.message].join(
            '\n',
          ),
          html: [
            '<h2>Nouveau message depuis le portfolio</h2>',
            `<p><strong>Nom</strong> : ${escapeHtml(message.name)}<br>`,
            `<strong>E-mail</strong> : ${escapeHtml(message.email)}</p>`,
            `<p style="white-space:pre-wrap">${escapeHtml(message.message)}</p>`,
          ].join(''),
        }),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`Resend responded ${response.status}: ${body.slice(0, 300)}`);
      }
    },
  };
}
