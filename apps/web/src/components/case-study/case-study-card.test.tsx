import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CaseStudyCard } from './case-study-card';
import { caseStudies } from '@/content/case-studies';

const study = caseStudies[0]!;

/**
 * Testing Library normalise les espaces du texte du DOM avant de comparer, et
 * `\s` inclut l'espace insecable. Le contenu francais en contient (avant ':',
 * '?', etc.), il faut donc normaliser aussi la chaine attendue, sinon la
 * comparaison echoue sur un caractere invisible.
 */
const normalise = (texte: string) => texte.replace(/\s+/g, ' ').trim();

describe('<CaseStudyCard />', () => {
  it('links to the case study page and shows its title, summary and tags', () => {
    render(
      <ul>
        <CaseStudyCard study={study} />
      </ul>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/work/${study.slug}`);
    expect(screen.getByText(normalise(study.title))).toBeInTheDocument();
    expect(screen.getByText(normalise(study.summary))).toBeInTheDocument();
    for (const tag of study.tags) {
      expect(screen.getByText(tag)).toBeInTheDocument();
    }
  });
});
