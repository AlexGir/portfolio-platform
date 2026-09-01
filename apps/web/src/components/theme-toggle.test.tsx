import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './theme-toggle';

beforeEach(() => {
  document.documentElement.classList.remove('dark');
  localStorage.clear();
});
afterEach(() => {
  document.documentElement.classList.remove('dark');
  localStorage.clear();
});

describe('<ThemeToggle />', () => {
  it('reflects the current theme in its accessible label', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'Activer le thème sombre' })).toBeInTheDocument();
  });

  it('toggles the .dark class and persists the choice', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole('button'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(screen.getByRole('button', { name: 'Activer le thème clair' })).toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
