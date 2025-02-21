import React from 'react';
import { useDataStore } from '../store/dataStore';
import { Database, Table2, BarChart2, ListFilter } from 'lucide-react';

export const DataSummary: React.FC = () => {
  const processedData = useDataStore(state => state.processedData);

  if (!processedData) return null;

  const { summary } = processedData;

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
          Dataset Overview
        </h2>
        <p className="text-lg text-white/70">
          Analyzing your data to provide insights and visualizations. Here's a quick summary of your dataset.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-purple-400" />
            <h3 className="font-medium text-white">Total Rows</h3>
          </div>
          <p className="text-3xl font-bold text-white">{summary.rowCount}</p>
          <p className="text-sm text-white/50 mt-1">Data points analyzed</p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Table2 className="h-5 w-5 text-purple-400" />
            <h3 className="font-medium text-white">Total Columns</h3>
          </div>
          <p className="text-3xl font-bold text-white">{summary.columnCount}</p>
          <p className="text-sm text-white/50 mt-1">Features available</p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <BarChart2 className="h-5 w-5 text-purple-400" />
            <h3 className="font-medium text-white">Numerical Columns</h3>
          </div>
          <p className="text-3xl font-bold text-white">{summary.numericalColumns.length}</p>
          <p className="text-sm text-white/50 mt-1">Quantitative features</p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <ListFilter className="h-5 w-5 text-purple-400" />
            <h3 className="font-medium text-white">Categorical Columns</h3>
          </div>
          <p className="text-3xl font-bold text-white">{summary.categoricalColumns.length}</p>
          <p className="text-sm text-white/50 mt-1">Qualitative features</p>
        </div>
      </div>
    </div>
  );
};