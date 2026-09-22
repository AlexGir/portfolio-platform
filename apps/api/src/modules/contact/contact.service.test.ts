import { describe, expect, it, vi } from 'vitest';
import { createResendMailer } from './contact.service.js';

const message = {
  name: 'Camille Dupont',
  email: 'camille@example.com',
  message: 'Bonjour, je souhaiterais discuter d’une mission de product design.',
  company: '',
};

function okResponse(): Response {
  return new Response(JSON.stringify({ id: 'abc' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

describe('createResendMailer', () => {
  it('posts the message to Resend with the sender we control', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okResponse());
    const mailer = createResendMailer({
      apiKey: 'test-key',
      from: 'contact@example.tech',
      to: 'owner@example.com',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await mailer.send(message);

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer test-key');

    const body = JSON.parse(init.body);
    // The visitor's address must never be the sender: we do not control their
    // domain, so SPF/DKIM would fail and the mail would land in spam.
    expect(body.from).toBe('contact@example.tech');
    expect(body.to).toEqual(['owner@example.com']);
    expect(body.reply_to).toBe('camille@example.com');
    expect(body.text).toContain(message.message);
  });

  it('escapes HTML so a message cannot inject markup into the email', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okResponse());
    const mailer = createResendMailer({
      apiKey: 'k',
      from: 'a@b.c',
      to: 'd@e.f',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await mailer.send({ ...message, message: '<script>alert(1)</script>' });

    const body = JSON.parse(fetchImpl.mock.calls[0]![1].body);
    expect(body.html).not.toContain('<script>');
    expect(body.html).toContain('&lt;script&gt;');
  });

  it('throws when Resend rejects the call', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(new Response('domain not verified', { status: 403 }));
    const mailer = createResendMailer({
      apiKey: 'k',
      from: 'a@b.c',
      to: 'd@e.f',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await expect(mailer.send(message)).rejects.toThrow(/403/);
  });
});
