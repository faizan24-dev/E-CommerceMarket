/**
 * A simple responsive table for dashboards.
 *
 *   <DataTable
 *     columns={[{ key: "title", header: "Product", render: (row) => row.title, className: "text-right" }]}
 *     rows={rows}
 *     getRowKey={(row) => row.id}
 *     empty={<EmptyState ... />}
 *   />
 */
export default function DataTable({ columns, rows, getRowKey, empty, caption }) {
  if (!rows.length) return empty ?? null;
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white">
      <table className="w-full min-w-[40rem] text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="border-b border-line bg-canvas text-xs uppercase tracking-wide text-muted">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className={`px-4 py-3 font-medium ${column.className ?? ""}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="align-top">
              {columns.map((column) => (
                <td key={column.key} className={`px-4 py-3.5 text-ink-soft ${column.className ?? ""}`}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
