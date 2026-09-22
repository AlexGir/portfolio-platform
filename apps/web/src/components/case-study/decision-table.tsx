import type { DecisionTable as DecisionTableData } from '@/content/case-studies';

/**
 * The options that were on the table and why one was picked. Shown inside a
 * process step — the part of a case study a recruiter reads to judge whether
 * decisions were reasoned or improvised.
 */
export function DecisionTable({ table }: { table: DecisionTableData }) {
  return (
    <div className="mt-8 -mr-6 overflow-x-auto pr-6 sm:mr-0 sm:pr-0">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b-2 border-rule">
            {table.headers.map((header) => (
              <th key={header} scope="col" className="eyebrow py-3 pr-5 text-muted">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => {
            const chosen = rowIndex === table.chosenRow;
            return (
              <tr key={row[0] ?? rowIndex} className="border-b border-border align-top">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`py-4 pr-5 ${
                      cellIndex === 0 ? 'font-medium text-fg' : 'text-muted'
                    } ${chosen && cellIndex === 0 ? 'text-accent-text dark:text-accent' : ''}`}
                  >
                    {chosen && cellIndex === 0 ? (
                      <span
                        aria-hidden="true"
                        className="mr-2 inline-block h-2 w-2 translate-y-[-1px] bg-accent"
                      />
                    ) : null}
                    {cell}
                    {chosen && cellIndex === 0 ? (
                      <span className="eyebrow mt-1.5 block text-muted">Option retenue</span>
                    ) : null}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
