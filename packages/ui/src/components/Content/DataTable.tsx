'use client';

import React from 'react';

interface DataTableProps {
  title?: string;
  headers: string[];
  rows: Array<{ cells: string[] }>;
}

/**
 * DataTable component for displaying structured data in Portable Text content
 *
 * @example
 * <DataTable
 *   title="Treatment Comparison"
 *   headers={['Treatment', 'Duration', 'Price Range']}
 *   rows={[
 *     { cells: ['NAD+ Therapy', '2-4 hours', '$500-$1,500'] },
 *     { cells: ['Stem Cell Therapy', '1-2 days', '$10,000-$50,000'] },
 *   ]}
 * />
 */
export function DataTable({ title, headers, rows }: DataTableProps) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-stone">
      {title && (
        <div className="border-b border-stone bg-gray-50 px-4 py-3">
          <h4 className="font-medium text-clarus-navy">{title}</h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone bg-clarus-navy text-white">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left font-medium"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-3 text-clarus-navy"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
