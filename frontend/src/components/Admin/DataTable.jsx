import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable data table with sortable columns, client-side pagination, row
 * selection and CSV export. `columns` is an array of
 * `{ key, label, sortable, render }` descriptors.
 */
export const DataTable = ({
  columns,
  data,
  pageSize = 10,
  selectable = false,
  onSelectionChange,
  exportFileName = 'export.csv',
  emptyMessage = 'داده‌ای برای نمایش وجود ندارد.',
}) => {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      return av > bv ? dir : -dir;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const rows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const updateSelection = (next) => {
    setSelected(next);
    if (onSelectionChange) onSelectionChange(Array.from(next));
  };

  const toggleRow = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    updateSelection(next);
  };

  const toggleAll = () => {
    if (selected.size === rows.length) updateSelection(new Set());
    else updateSelection(new Set(rows.map((r) => r.id)));
  };

  const exportCSV = () => {
    const cols = columns.map((c) => c.key);
    const header = columns.map((c) => c.label).join(',');
    const lines = sorted.map((row) =>
      cols.map((c) => JSON.stringify(row[c] ?? '')).join(',')
    );
    const csv = ["﻿" + header, ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exportFileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {sorted.length} مورد
        </span>
        <button type="button" onClick={exportCSV} className="btn-secondary text-sm">
          دانلود CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {selectable && (
                <th className="p-2">
                  <input
                    type="checkbox"
                    aria-label="انتخاب همه"
                    checked={rows.length > 0 && selected.size === rows.length}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} className="p-2 font-medium text-gray-700 dark:text-gray-300">
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      {col.label}
                      {sortKey === col.key && (
                        <span>{sortDir === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="p-4 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  {selectable && (
                    <td className="p-2">
                      <input
                        type="checkbox"
                        aria-label={`انتخاب ردیف ${row.id}`}
                        checked={selected.has(row.id)}
                        onChange={() => toggleRow(row.id)}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="p-2 text-gray-900 dark:text-gray-100">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-3">
        <button
          type="button"
          className="btn-secondary text-sm"
          disabled={currentPage <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          قبلی
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          صفحه {currentPage} از {totalPages}
        </span>
        <button
          type="button"
          className="btn-secondary text-sm"
          disabled={currentPage >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          بعدی
        </button>
      </div>
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageSize: PropTypes.number,
  selectable: PropTypes.bool,
  onSelectionChange: PropTypes.func,
  exportFileName: PropTypes.string,
  emptyMessage: PropTypes.string,
};

export default DataTable;
