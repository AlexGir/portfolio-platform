import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Expertise } from './expertise';
import { expertiseAreas } from '@/content/expertise';

describe('<Expertise />', () => {
  it('renders the section heading', () => {
    render(<Expertise />);
    expect(screen.getByRole('heading', { level: 2, name: 'Expertise' })).toBeInTheDocument();
  });

  it('renders every area with its skills', () => {
    render(<Expertise />);
    for (const area of expertiseAreas) {
      expect(screen.getByRole('heading', { level: 3, name: area.title })).toBeInTheDocument();
      for (const skill of area.skills) {
        expect(screen.getAllByText(skill).length).toBeGreaterThan(0);
      }
    }
  });
});
