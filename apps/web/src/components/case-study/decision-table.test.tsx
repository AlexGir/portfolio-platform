import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DecisionTable } from './decision-table';
import type { DecisionTable as DecisionTableData } from '@/content/case-studies';

const table: DecisionTableData = {
  headers: ['Option', 'Atout', 'Limite'],
  rows: [
    ['HTML/CSS natif', 'Liberté totale', 'Tout à reconstruire'],
    ['Material UI', 'Thématisation dynamique', 'Look à neutraliser'],
  ],
  chosenRow: 1,
};

describe('<DecisionTable />', () => {
  it('renders every header as a column header', () => {
    render(<DecisionTable table={table} />);
    for (const header of table.headers) {
      expect(screen.getByRole('columnheader', { name: header })).toBeInTheDocument();
    }
  });

  it('renders every cell of every row', () => {
    render(<DecisionTable table={table} />);
    for (const cell of table.rows.flat()) {
      expect(screen.getByText(cell)).toBeInTheDocument();
    }
  });

  it('marks only the chosen row', () => {
    render(<DecisionTable table={table} />);
    expect(screen.getAllByText('Option retenue')).toHaveLength(1);
  });

  it('marks no row when no option is flagged as chosen', () => {
    render(<DecisionTable table={{ ...table, chosenRow: undefined }} />);
    expect(screen.queryByText('Option retenue')).not.toBeInTheDocument();
  });
});
