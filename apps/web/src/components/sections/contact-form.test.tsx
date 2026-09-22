import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './contact-form';

function mockFetch(response: Response) {
  const spy = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', spy);
  return spy;
}

function accepted(): Response {
  return new Response(JSON.stringify({ status: 'sent' }), {
    status: 202,
    headers: { 'content-type': 'application/json' },
  });
}

function errorResponse(status: number, code: string): Response {
  return new Response(JSON.stringify({ error: { code, message: 'nope' } }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nom'), 'Camille Dupont');
  await user.type(screen.getByLabelText('E-mail'), 'camille@example.com');
  await user.type(
    screen.getByLabelText('Message'),
    'Bonjour, je souhaiterais discuter dune mission de product design.',
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('<ContactForm />', () => {
  it('posts the message and confirms once it is sent', async () => {
    const user = userEvent.setup();
    const fetchSpy = mockFetch(accepted());

    render(<ContactForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Envoyer le message' }));

    await waitFor(() => expect(screen.getByText(/Message envoyé/)).toBeInTheDocument());

    const [, init] = fetchSpy.mock.calls[0]!;
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toMatchObject({
      name: 'Camille Dupont',
      email: 'camille@example.com',
    });
  });

  it('shows field errors without calling the API', async () => {
    const user = userEvent.setup();
    const fetchSpy = mockFetch(accepted());

    render(<ContactForm />);
    await user.type(screen.getByLabelText('Nom'), 'A');
    await user.type(screen.getByLabelText('E-mail'), 'pas-un-email');
    await user.type(screen.getByLabelText('Message'), 'court');
    await user.click(screen.getByRole('button', { name: 'Envoyer le message' }));

    expect(await screen.findByText('Adresse e-mail invalide.')).toBeInTheDocument();
    expect(screen.getByText(/au moins 20 caractères/)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('falls back to the direct address when the form is not configured', async () => {
    const user = userEvent.setup();
    mockFetch(errorResponse(503, 'contact_unavailable'));

    render(<ContactForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Envoyer le message' }));

    expect(await screen.findByText(/momentanément indisponible/)).toBeInTheDocument();
  });

  it('explains a rate-limit rejection rather than showing a generic failure', async () => {
    const user = userEvent.setup();
    mockFetch(errorResponse(429, 'too_many_requests'));

    render(<ContactForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Envoyer le message' }));

    expect(await screen.findByText(/Trop de messages/)).toBeInTheDocument();
  });

  it('keeps a honeypot field that is hidden from assistive technology', () => {
    render(<ContactForm />);
    const honeypot = document.querySelector('input[name="company"]');
    expect(honeypot).not.toBeNull();
    expect(honeypot?.closest('[aria-hidden="true"]')).not.toBeNull();
  });
});
