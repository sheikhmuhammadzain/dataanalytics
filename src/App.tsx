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
import { LandingPage } from './components/LandingPage';

function App() {
  const processedData = useDataStore(state => state.processedData);

  if (!processedData) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-6 w-6" />
            <h1 className="font-bold text-xl">AwaisAnalytics</h1>
          </div>
          <FileUpload />
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <div className="grid gap-8">
          <DataSummary />
          
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Data Exploration</h3>
            <SearchFilter />
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">AI Chat Assistant</h3>
            <DataChat />
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Column Selection</h3>
            <ColumnSelector />
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Column Statistics</h3>
            <ColumnStatistics />
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Visualizations</h3>
            <DataVisualizations />
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Data Preview</h3>
            <DataTable />
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 AwaisAnalytics. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </a>
            <a href="#terms" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;