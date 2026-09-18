import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReflectionCallout } from './reflection-callout';

describe('<ReflectionCallout />', () => {
  it('renders the label and the quoted text', () => {
    render(<ReflectionCallout label="Ce que ce projet a confirmé" text="Une idée simple." />);
    expect(screen.getByText('Ce que ce projet a confirmé')).toBeInTheDocument();
    expect(screen.getByText(/Une idée simple\./)).toBeInTheDocument();
  });
});
