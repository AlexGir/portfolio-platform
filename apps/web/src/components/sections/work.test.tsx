import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Work } from './work';
import { projects } from '@/content/projects';

describe('<Work />', () => {
  it('renders a heading and every project title', () => {
    render(<Work />);
    expect(screen.getByRole('heading', { level: 2, name: 'Projets' })).toBeInTheDocument();
    for (const project of projects) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
  });

  it('opens external project links safely in a new tab', () => {
    render(<Work />);
    const withLink = projects.find((p) => p.href)!;
    const link = screen.getByRole('link', { name: withLink.title });
    expect(link).toHaveAttribute('href', withLink.href);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });

  it('shows role and stack for each project', () => {
    render(<Work />);
    const items = screen.getAllByRole('listitem');
    const first = items.find((el) => within(el).queryByText(projects[0]!.title));
    expect(first).toBeDefined();
    expect(within(first!).getByText(projects[0]!.role)).toBeInTheDocument();
  });
});
