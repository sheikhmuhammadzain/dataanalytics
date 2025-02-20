import React from 'react';
import { useDataStore } from '../store/dataStore';

export const DataTable: React.FC = () => {
  const { processedData, getFilteredData } = useDataStore();
  const filteredData = getFilteredData();

  if (!processedData) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {processedData.headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.slice(0, 100).map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {processedData.headers.map((header) => (
                  <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row[header] === null || row[header] === undefined ? '-' : String(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredData.length > 100 && (
        <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">
          Showing first 100 rows of {filteredData.length} total rows
        </div>
      )}
    </div>
  );
};