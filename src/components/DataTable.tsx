import React from 'react';
import { useDataStore } from '../store/dataStore';

export const DataTable: React.FC = () => {
  const { processedData, getFilteredData } = useDataStore();
  const filteredData = getFilteredData();

  if (!processedData) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-indigo-500/10">
      <table className="w-full min-w-full divide-y divide-indigo-500/10">
        <thead className="bg-indigo-500/5">
          <tr>
            {processedData.headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left text-sm font-semibold text-white/90 whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-indigo-500/10">
          {filteredData.slice(0, 100).map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              className="hover:bg-indigo-500/5 transition-colors"
            >
              {processedData.headers.map((header, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  className="px-6 py-4 text-sm text-white/70 whitespace-nowrap"
                >
                  {row[header] === null || row[header] === undefined ? '-' : String(row[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};