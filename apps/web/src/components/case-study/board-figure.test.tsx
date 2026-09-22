import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BoardFigure, BoardGallery } from './board-figure';
import type { Board } from '@/content/case-studies';

const board: Board = {
  src: '/planches/skales-refonte/02-personas.html',
  title: 'Personas',
  caption: 'Quatre profils construits à partir des entretiens menés pendant la recherche.',
};

describe('<BoardFigure />', () => {
  it('links the board to its full-size file in a new tab', () => {
    render(<BoardFigure board={board} />);
    const link = screen.getByRole('link', { name: /Ouvrir la planche « Personas » en grand/ });
    expect(link).toHaveAttribute('href', board.src);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('shows the title and caption as text, not only inside the image', () => {
    render(<BoardFigure board={board} />);
    expect(screen.getByText(board.title)).toBeInTheDocument();
    expect(screen.getByText(board.caption)).toBeInTheDocument();
  });

  it('previews the board with the PNG rendered beside its HTML source', () => {
    render(<BoardFigure board={board} />);
    const image = screen.getByRole('img', { name: /Planche de design : Personas/ });
    expect(image).toHaveAttribute('src', '/planches/skales-refonte/02-personas.png');
    // Explicit dimensions keep the layout from shifting while the board loads.
    expect(image).toHaveAttribute('width', '1800');
    expect(image).toHaveAttribute('height', '1069');
    expect(image).toHaveAttribute('loading', 'lazy');
  });
});

describe('<BoardGallery />', () => {
  it('renders nothing for an empty list', () => {
    const { container } = render(<BoardGallery boards={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('adds the reconstruction note only when asked', () => {
    const note = /Planches reconstituées en 2026/;

    const { unmount } = render(<BoardGallery boards={[board]} />);
    expect(screen.queryByText(note)).not.toBeInTheDocument();
    unmount();

    render(<BoardGallery boards={[board]} note />);
    expect(screen.getByText(note)).toBeInTheDocument();
  });
});
