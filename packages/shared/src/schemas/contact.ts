import { z } from 'zod';

/**
 * A message sent from the portfolio's contact form.
 *
 * `company` is a honeypot: it is hidden from real users, so anything that fills
 * it is a bot. It deliberately accepts any value — rejecting it here would
 * return a 400 that tells the bot it was detected. The router decides instead,
 * and answers a bot exactly what it answers a human.
 */
export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, 'Indiquez votre nom.').max(120, 'Nom trop long.'),
  email: z.string().trim().email('Adresse e-mail invalide.').max(200),
  message: z
    .string()
    .trim()
    .min(20, 'Votre message doit faire au moins 20 caractères.')
    .max(5000, 'Votre message est trop long (5000 caractères maximum).'),
  /** Honeypot — empty for a human; see the note above. */
  company: z.string().max(200).optional().default(''),
});
export type ContactMessage = z.infer<typeof contactMessageSchema>;

/** Response body for a successfully queued message. */
export const contactResponseSchema = z.object({
  status: z.literal('sent'),
});
export type ContactResponse = z.infer<typeof contactResponseSchema>;
