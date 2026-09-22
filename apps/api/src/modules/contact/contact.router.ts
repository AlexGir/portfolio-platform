import { Router } from 'express';
import { contactMessageSchema } from '@portfolio/shared';
import { badRequest, serviceUnavailable } from '../../lib/http-error.js';
import type { Mailer } from './contact.service.js';

export interface ContactRouterDeps {
  /** Absent when the mail transport is not configured — the route then 503s. */
  mailer: Mailer | null;
}

/**
 * `POST /contact` — the portfolio's contact form.
 *
 * Bots that fill the honeypot get the same 202 as a real visitor: telling them
 * they were detected only helps them adapt. Nothing is sent in that case.
 */
export function contactRouter({ mailer }: ContactRouterDeps): Router {
  const router = Router();

  router.post('/contact', async (req, res, next) => {
    if (!mailer) {
      next(
        serviceUnavailable(
          "Le formulaire de contact n'est pas configuré sur ce serveur.",
          'contact_unavailable',
        ),
      );
      return;
    }

    const parsed = contactMessageSchema.safeParse(req.body);

    if (!parsed.success) {
      next(
        badRequest(
          'Message invalide.',
          parsed.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        ),
      );
      return;
    }

    if (parsed.data.company !== '') {
      res.status(202).json({ status: 'sent' });
      return;
    }

    try {
      await mailer.send(parsed.data);
      res.status(202).json({ status: 'sent' });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
