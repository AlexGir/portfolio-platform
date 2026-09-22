import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { errorHandler, notFoundHandler } from '../../middleware/error-handler.js';
import { silentLogger } from '../../lib/logger.js';
import { contactRouter } from './contact.router.js';
import type { Mailer } from './contact.service.js';

const valid = {
  name: 'Camille Dupont',
  email: 'camille@example.com',
  message: 'Bonjour, je souhaiterais discuter d’une mission de product design avec vous.',
};

/** The contact route touches no database, so it is mounted on its own. */
function appWith(mailer: Mailer | null) {
  const app = express();
  app.use(express.json());
  app.use(contactRouter({ mailer }));
  app.use(notFoundHandler);
  app.use(errorHandler(silentLogger));
  return app;
}

function fakeMailer(): Mailer & { sent: unknown[] } {
  const sent: unknown[] = [];
  return {
    sent,
    async send(message) {
      sent.push(message);
    },
  };
}

describe('POST /contact', () => {
  it('accepts a valid message and hands it to the mailer', async () => {
    const mailer = fakeMailer();
    const res = await request(appWith(mailer)).post('/contact').send(valid);

    expect(res.status).toBe(202);
    expect(res.body).toEqual({ status: 'sent' });
    expect(mailer.sent).toHaveLength(1);
    expect(mailer.sent[0]).toMatchObject({ email: valid.email, name: valid.name });
  });

  it('rejects an invalid payload with per-field details', async () => {
    const mailer = fakeMailer();
    const res = await request(appWith(mailer))
      .post('/contact')
      .send({ name: 'A', email: 'not-an-email', message: 'trop court' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('bad_request');
    expect(mailer.sent).toHaveLength(0);
  });

  it('silently drops a submission that fills the honeypot', async () => {
    const mailer = fakeMailer();
    const res = await request(appWith(mailer))
      .post('/contact')
      .send({ ...valid, company: 'Spam Corp' });

    // Same 202 a human gets: telling a bot it was caught only helps it adapt.
    expect(res.status).toBe(202);
    expect(mailer.sent).toHaveLength(0);
  });

  it('answers 503 when no mail transport is configured', async () => {
    const res = await request(appWith(null)).post('/contact').send(valid);

    expect(res.status).toBe(503);
    expect(res.body.error.code).toBe('contact_unavailable');
  });

  it('surfaces a transport failure as a 500 rather than a false success', async () => {
    const mailer: Mailer = { send: vi.fn().mockRejectedValue(new Error('resend down')) };
    const res = await request(appWith(mailer)).post('/contact').send(valid);

    expect(res.status).toBe(500);
  });
});
