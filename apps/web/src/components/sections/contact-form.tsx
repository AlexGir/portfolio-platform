'use client';

import { useId, useState } from 'react';
import { contactMessageSchema, type ContactResponse } from '@portfolio/shared';
import { ApiError, apiFetch } from '@/lib/api';
import { profile } from '@/content/profile';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const FIELD_CLASS =
  'w-full border border-border bg-bg px-4 py-3 text-base text-fg outline-none transition-colors placeholder:text-muted/70 focus:border-accent';

export function ContactForm() {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const companyId = useId();
  const statusId = useId();

  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // Validate with the same schema the API uses, so the visitor gets the
    // message before a round trip rather than after it.
    const parsed = contactMessageSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join('.');
        errors[key] ??= issue.message;
      }
      setFieldErrors(errors);
      setStatus('error');
      setError(null);
      return;
    }

    setFieldErrors({});
    setStatus('sending');
    setError(null);

    try {
      await apiFetch<ContactResponse>('/contact', {
        method: 'POST',
        body: JSON.stringify(parsed.data),
      });
      setStatus('sent');
      form.reset();
    } catch (cause) {
      setStatus('error');
      if (cause instanceof ApiError && cause.code === 'contact_unavailable') {
        setError(
          `Le formulaire est momentanément indisponible. Écrivez-moi directement à ${profile.email}.`,
        );
      } else if (cause instanceof ApiError && cause.status === 429) {
        setError('Trop de messages envoyés depuis cette adresse. Réessayez dans un moment.');
      } else {
        setError(`L'envoi a échoué. Vous pouvez m'écrire directement à ${profile.email}.`);
      }
    }
  }

  if (status === 'sent') {
    return (
      <div className="border-l-4 border-accent bg-surface p-6" role="status" aria-live="polite">
        <p className="eyebrow text-accent-text dark:text-accent">Message envoyé</p>
        <p className="mt-3 text-lg">
          Merci, votre message est parti. Je réponds généralement sous 48 heures ouvrées.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-5 border-b-2 border-rule pb-0.5 text-sm font-medium transition-colors hover:border-accent"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={nameId} className="eyebrow text-muted">
            Nom
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? `${nameId}-error` : undefined}
            className={`mt-2 ${FIELD_CLASS}`}
          />
          {fieldErrors.name ? (
            <p id={`${nameId}-error`} className="mt-1.5 text-sm text-accent-text dark:text-accent">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={emailId} className="eyebrow text-muted">
            E-mail
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? `${emailId}-error` : undefined}
            className={`mt-2 ${FIELD_CLASS}`}
          />
          {fieldErrors.email ? (
            <p id={`${emailId}-error`} className="mt-1.5 text-sm text-accent-text dark:text-accent">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor={messageId} className="eyebrow text-muted">
          Message
        </label>
        <textarea
          id={messageId}
          name="message"
          rows={5}
          required
          placeholder="Le contexte, le besoin, le calendrier…"
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? `${messageId}-error` : undefined}
          className={`mt-2 resize-y ${FIELD_CLASS}`}
        />
        {fieldErrors.message ? (
          <p id={`${messageId}-error`} className="mt-1.5 text-sm text-accent-text dark:text-accent">
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot: off-screen and hidden from assistive tech, so only bots fill it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={companyId}>Société (ne pas remplir)</label>
        <input id={companyId} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-accent-strong px-6 py-3 text-sm font-medium text-accent-fg transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'}
        </button>

        <a
          href={`mailto:${profile.email}`}
          className="text-sm text-muted transition-colors hover:text-fg"
        >
          ou m&apos;écrire directement
        </a>
      </div>

      <p id={statusId} role="status" aria-live="polite" className="mt-4 text-sm">
        {error ? <span className="text-accent-text dark:text-accent">{error}</span> : null}
      </p>
    </form>
  );
}
