import React, { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import { Search } from 'lucide-react';

interface DataTableProps {
  showFilters: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({ showFilters }) => {
  const { processedData, getFilteredData } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  
  if (!processedData) return null;

  const filteredData = getFilteredData();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Update the store's filter value
    useDataStore.getState().setFilterValue(value);
  };

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search in data..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/90 placeholder-white/50 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg text-white/90 px-4 py-2 focus:outline-none focus:border-indigo-500/50"
          >
            <option value="">All Columns</option>
            {processedData.headers.map(header => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-white/[0.2] bg-black/40 backdrop-blur-sm">
        <table className="w-full min-w-full divide-y divide-white/[0.2]">
          <thead className="bg-white/5">
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
          <tbody className="divide-y divide-white/[0.2]">
            {filteredData.slice(0, 100).map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className="hover:bg-white/5 transition-colors"
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
    </div>
  );
};