import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WorkPreview } from './work-preview';
import { caseStudies } from '@/content/case-studies';

describe('<WorkPreview />', () => {
  it('renders a heading and every case study title', () => {
    render(<WorkPreview />);
    expect(screen.getByRole('heading', { level: 2, name: 'Projets' })).toBeInTheDocument();
    for (const study of caseStudies) {
      expect(screen.getByText(study.title)).toBeInTheDocument();
    }
  });

  it('links each card to its case study page', () => {
    render(<WorkPreview />);
    for (const study of caseStudies) {
      const link = screen.getByRole('link', { name: new RegExp(study.title) });
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
