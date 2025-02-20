import React from 'react';
import { useDataStore } from '../store/dataStore';
import { BarChart2, Database, List, Table } from 'lucide-react';

export const DataSummary: React.FC = () => {
  const processedData = useDataStore(state => state.processedData);

  if (!processedData) return null;

  const { summary } = processedData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Total Rows</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{summary.rowCount}</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3">
          <Table className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Total Columns</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{summary.columnCount}</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3">
          <BarChart2 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Numerical Columns</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{summary.numericalColumns.length}</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3">
          <List className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Categorical Columns</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{summary.categoricalColumns.length}</p>
      </div>
    </div>
  );
};