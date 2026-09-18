import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProcessStep } from './process-step';
import type { ProcessStep as ProcessStepData } from '@/content/case-studies';

const step: ProcessStepData = {
  index: '01',
  title: 'Le premier réflexe était le mauvais',
  body: ['Un premier paragraphe.', 'Un second paragraphe.'],
  detail: {
    heading: 'Ce que ça a changé',
    bullets: ['Premier point', 'Second point'],
  },
};

describe('<ProcessStep />', () => {
  it('renders the index, title and every body paragraph', () => {
    render(
      <ol>
        <ProcessStep step={step} />
      </ol>,
    );
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: step.title })).toBeInTheDocument();
    for (const paragraph of step.body) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
  });

  it('renders the detail callout when present', () => {
    render(
      <ol>
        <ProcessStep step={step} />
      </ol>,
    );
    expect(screen.getByText(step.detail!.heading)).toBeInTheDocument();
    for (const bullet of step.detail!.bullets) {
      expect(screen.getByText(bullet)).toBeInTheDocument();
    }
  });

  it('omits the callout block when there is no detail', () => {
    const { queryByText } = render(
      <ol>
        <ProcessStep step={{ ...step, detail: undefined }} />
      </ol>,
    );
    expect(queryByText(step.detail!.heading)).not.toBeInTheDocument();
  });
});
