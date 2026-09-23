import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

const mockEnv = vi.hoisted(() => ({ umami: { src: '', websiteId: '' } }));
vi.mock('@/lib/env', () => ({ env: mockEnv }));
// next/script renders nothing useful in jsdom; a plain script keeps the test honest.
vi.mock('next/script', () => ({
  default: (props: Record<string, unknown>) => <script {...props} />,
}));

const { Analytics } = await import('./analytics');

describe('<Analytics />', () => {
  beforeEach(() => {
    mockEnv.umami = { src: '', websiteId: '' };
  });

  it('renders nothing when Umami is not configured', () => {
    const { container } = render(<Analytics />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when only one of the two variables is set', () => {
    mockEnv.umami = { src: 'https://analytics.example.tech/script.js', websiteId: '' };
    const { container } = render(<Analytics />);
    expect(container).toBeEmptyDOMElement();
  });

  it('loads the tracker and honours Do Not Track once configured', () => {
    mockEnv.umami = { src: 'https://analytics.example.tech/script.js', websiteId: 'abc-123' };
    const { container } = render(<Analytics />);

    const tag = container.querySelector('script');
    expect(tag).toHaveAttribute('src', 'https://analytics.example.tech/script.js');
    expect(tag).toHaveAttribute('data-website-id', 'abc-123');
    expect(tag).toHaveAttribute('data-do-not-track', 'true');
  });
});
