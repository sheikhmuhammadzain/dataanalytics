import React from 'react';
import { useDataStore } from '../store/dataStore';

export const ColumnSelector: React.FC = () => {
  const { processedData, selectedColumns, setSelectedColumns } = useDataStore();

  if (!processedData) return null;

  const handleColumnToggle = (column: string) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(c => c !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Column Selection</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {processedData.headers.map(column => (
          <label key={column} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedColumns.includes(column)}
              onChange={() => handleColumnToggle(column)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{column}</span>
          </label>
        ))}
      </div>
    </div>
  );
};