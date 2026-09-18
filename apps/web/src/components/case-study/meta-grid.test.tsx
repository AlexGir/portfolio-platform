import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetaGrid } from './meta-grid';

const meta = {
  client: 'Acme SaaS',
  role: 'Product designer',
  timeline: '6 semaines',
  whatChanged: 'Un onboarding en 4 étapes',
};

describe('<MetaGrid />', () => {
  it('renders every quick fact with its label', () => {
    render(<MetaGrid meta={meta} />);
    expect(screen.getByText('Client')).toBeInTheDocument();
    expect(screen.getByText(meta.client)).toBeInTheDocument();
    expect(screen.getByText('Rôle')).toBeInTheDocument();
    expect(screen.getByText(meta.role)).toBeInTheDocument();
    expect(screen.getByText('Durée')).toBeInTheDocument();
    expect(screen.getByText(meta.timeline)).toBeInTheDocument();
    expect(screen.getByText('Ce qui a changé')).toBeInTheDocument();
    expect(screen.getByText(meta.whatChanged)).toBeInTheDocument();
  });
});
