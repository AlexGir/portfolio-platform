import type { DecisionTable as DecisionTableData } from '@/content/case-studies';

/**
 * The options that were on the table and why one was picked. Shown inside a
 * process step — the part of a case study a recruiter reads to judge whether
 * decisions were reasoned or improvised.
 *
 * Below `sm` the table stops being a table: three columns of prose cannot be
 * read at 325px, and making it scroll sideways is worse, because a comparison
 * you cannot see whole is not a comparison. Each row becomes a block titled by
 * its option, with every other cell introduced by its column name, which the
 * CSS pulls from `data-label` (see `.decision-table` in globals.css).
 *
 * The roles are spelled out because that transformation would otherwise strip
 * the table semantics: switching a `td` to `display: block` drops its implicit
 * role, and a screen reader would lose the structure exactly where the content
 * matters most.
 */
/* eslint-disable jsx-a11y/no-redundant-roles, jsx-a11y/no-interactive-element-to-noninteractive-role --
   These roles are redundant in the default layout, which is what the rules
   flag. They stop being redundant below `sm`, where `display: block` drops the
   implicit table roles. Removing them would silence the linter at the cost of
   the structure a screen reader needs. */
export function DecisionTable({ table }: { table: DecisionTableData }) {
  return (
    <div className="decision-table mt-8 sm:-mr-6 sm:overflow-x-auto sm:pr-6 lg:mr-0 lg:pr-0">
      <table role="table" className="w-full border-collapse text-left text-sm sm:min-w-[36rem]">
        <thead role="rowgroup">
          <tr role="row" className="border-b-2 border-rule">
            {table.headers.map((header) => (
              <th
                key={header}
                role="columnheader"
                scope="col"
                className="eyebrow py-3 pr-5 text-muted"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {table.rows.map((row, rowIndex) => {
            const chosen = rowIndex === table.chosenRow;
            return (
              <tr role="row" key={row[0] ?? rowIndex} className="border-b border-border align-top">
                {row.map((cell, cellIndex) => (
                  <td
                    role="cell"
                    key={cellIndex}
                    data-label={table.headers[cellIndex]}
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
