import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImpactGrid } from './impact-grid';

const impact = [
  { label: 'Activation', value: '+41 %' },
  { label: 'Abandon', value: '−52 %' },
];

describe('<ImpactGrid />', () => {
  it('renders every metric value and label', () => {
    render(<ImpactGrid impact={impact} />);
    for (const metric of impact) {
      expect(screen.getByText(metric.value)).toBeInTheDocument();
      expect(screen.getByText(metric.label)).toBeInTheDocument();
    }
  });
});
