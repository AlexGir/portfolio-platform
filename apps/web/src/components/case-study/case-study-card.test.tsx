import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CaseStudyCard } from './case-study-card';
import { caseStudies } from '@/content/case-studies';

const study = caseStudies[0]!;

describe('<CaseStudyCard />', () => {
  it('links to the case study page and shows its title, summary and tags', () => {
    render(
      <ul>
        <CaseStudyCard study={study} />
      </ul>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/work/${study.slug}`);
    expect(screen.getByText(study.title)).toBeInTheDocument();
    expect(screen.getByText(study.summary)).toBeInTheDocument();
    for (const tag of study.tags) {
      expect(screen.getByText(tag)).toBeInTheDocument();
    }
  });
});
