import React from 'react';
import { useDataStore } from '../store/dataStore';

export const DataTable: React.FC = () => {
  const { processedData, getFilteredData } = useDataStore();
  const filteredData = getFilteredData();

  if (!processedData) return null;

  return (
    <div className="rounded-lg border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              {processedData.headers.map((header) => (
                <th
                  key={header}
                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {filteredData.slice(0, 100).map((row, idx) => (
              <tr
                key={idx}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                {processedData.headers.map((header) => (
                  <td
                    key={header}
                    className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                  >
                    {row[header] === null || row[header] === undefined ? '-' : String(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredData.length > 100 && (
        <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
          Showing first 100 rows of {filteredData.length} total rows
        </div>
      )}
    </div>
  );
};