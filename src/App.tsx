import React from 'react';
import { FileUpload } from './components/FileUpload';
import { DataSummary } from './components/DataSummary';
import { DataVisualizations } from './components/DataVisualizations';
import { DataTable } from './components/DataTable';
import { ColumnSelector } from './components/ColumnSelector';
import { ColumnStatistics } from './components/ColumnStatistics';
import { SearchFilter } from './components/SearchFilter';
import { DataChat } from './components/DataChat';
import { useDataStore } from './store/dataStore';
import { BarChart2 } from 'lucide-react';

function App() {
  const processedData = useDataStore(state => state.processedData);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Data Analytics Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {!processedData && (
            <div className="flex flex-col items-center justify-center py-12">
              <FileUpload />
              <p className="mt-4 text-sm text-gray-500">
                Upload a CSV file to start analyzing your data
              </p>
            </div>
          )}

          {processedData && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Data Analysis</h2>
                <FileUpload />
              </div>

              <div className="space-y-8">
                <DataSummary />
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">Data Exploration</h3>
                  <SearchFilter />
                </div>

                <DataChat />

                <ColumnSelector />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Column Statistics</h3>
                  <ColumnStatistics />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Visualizations</h3>
                  <DataVisualizations />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Data Preview</h3>
                  <DataTable />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;