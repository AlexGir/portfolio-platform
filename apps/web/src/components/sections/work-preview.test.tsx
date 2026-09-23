import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WorkPreview } from './work-preview';
import { caseStudies } from '@/content/case-studies';

/**
 * Testing Library normalise les espaces du texte du DOM avant de comparer, et
 * `\s` inclut l'espace insecable. Le contenu francais en contient (avant ':',
 * '?', etc.), il faut donc normaliser aussi la chaine attendue, sinon la
 * comparaison echoue sur un caractere invisible.
 */
const normalise = (texte: string) => texte.replace(/\s+/g, ' ').trim();

/**
 * Un matcher fonction plutot qu'une RegExp : plusieurs titres contiennent '?',
 * qui est un quantificateur en expression reguliere. Comparer les chaines
 * normalisees evite d'avoir a echapper quoi que ce soit.
 */
const contient = (attendu: string) => (nomAccessible: string) =>
  normalise(nomAccessible).includes(normalise(attendu));

describe('<WorkPreview />', () => {
  it('renders a heading and every case study title', () => {
    render(<WorkPreview />);
    expect(screen.getByRole('heading', { level: 2, name: 'Projets' })).toBeInTheDocument();
    for (const study of caseStudies) {
      expect(screen.getByText(normalise(study.title))).toBeInTheDocument();
    }
  });

  it('links each card to its case study page', () => {
    render(<WorkPreview />);
    for (const study of caseStudies) {
      const link = screen.getByRole('link', { name: contient(study.title) });
      expect(link).toHaveAttribute('href', `/work/${study.slug}`);
    }
  });

  it('links to the full work index', () => {
    render(<WorkPreview />);
    expect(screen.getByRole('link', { name: /Voir tous les projets/ })).toHaveAttribute(
      'href',
      '/work',
    );
  });
});
