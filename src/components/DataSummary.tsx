import React from 'react';
import { useDataStore } from '../store/dataStore';
import { BarChart2, Database, List, Table } from 'lucide-react';

export const DataSummary: React.FC = () => {
  const processedData = useDataStore(state => state.processedData);

  if (!processedData) return null;

  const { summary } = processedData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold">Total Rows</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{summary.rowCount}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <Table className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-semibold">Total Columns</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{summary.columnCount}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <BarChart2 className="w-6 h-6 text-purple-500" />
          <h3 className="text-lg font-semibold">Numerical Columns</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{summary.numericalColumns.length}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <List className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg font-semibold">Categorical Columns</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{summary.categoricalColumns.length}</p>
      </div>
    </div>
  );
};