import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteFooter } from './site-footer';
import { BoardFigure } from './case-study/board-figure';
import { Hero } from './sections/hero';
import type { Board } from '@/content/case-studies';

/**
 * Les evenements Umami passent par des attributs HTML : rien ne casse s'ils
 * disparaissent, la mesure devient juste muette sans que personne ne le voie.
 * Ces tests rendent cette perte visible.
 */
function events(container: HTMLElement) {
  return [...container.querySelectorAll('[data-umami-event]')].map((el) => ({
    event: el.getAttribute('data-umami-event'),
    source: el.getAttribute('data-umami-event-source'),
  }));
}

describe('evenements Umami', () => {
  it('marque le CV et les reseaux dans le pied de page', () => {
    const { container } = render(<SiteFooter />);
    const tagged = events(container);

    expect(tagged).toContainEqual({ event: 'cv-ouvert', source: 'pied-de-page' });
    expect(tagged).toContainEqual({ event: 'email-clique', source: 'pied-de-page' });
    expect(tagged.filter((t) => t.event === 'reseau-ouvert').length).toBeGreaterThan(0);
  });

  it('marque le CV et le CTA du hero', () => {
    const { container } = render(<Hero />);
    const tagged = events(container);

    expect(tagged).toContainEqual({ event: 'cv-ouvert', source: 'hero' });
    expect(tagged.map((t) => t.event)).toContain('cta-projets');
  });

  it('nomme la planche ouverte, pour distinguer quel livrable interesse', () => {
    const board: Board = {
      src: '/planches/skales-refonte/02-personas.html',
      title: 'Personas',
      caption: 'Quatre profils construits a partir des entretiens menes pendant la recherche.',
    };
    render(<BoardFigure board={board} />);

    const link = screen.getByRole('link', { name: /Ouvrir la planche/ });
    expect(link).toHaveAttribute('data-umami-event', 'planche-ouverte');
    expect(link).toHaveAttribute('data-umami-event-planche', 'Personas');
  });

  it('ne marque pas les liens internes : la navigation Next les gere deja', () => {
    // Umami intercepte le clic sur un element porteur de l'attribut, ce qui
    // peut empecher les gestionnaires internes de se declencher. Les pages vues
    // couvrent deja la navigation interne.
    const { container } = render(<Hero />);
    for (const el of container.querySelectorAll('[data-umami-event]')) {
      const href = el.getAttribute('href') ?? '';
      expect(href.startsWith('/work/'), `lien interne marque : ${href}`).toBe(false);
    }
  });
});
