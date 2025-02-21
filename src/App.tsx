import React from 'react';
import { FileUpload } from './components/FileUpload';
import { DataSummary } from './components/DataSummary';
import { DefaultVisualizations } from './components/DefaultVisualizations';
import { DataTable } from './components/DataTable';
import { DataChat } from './components/DataChat';
import { useDataStore } from './store/dataStore';
import { BarChart2, Table2 } from 'lucide-react';
import { LandingPage } from './components/LandingPage';

function App() {
  const processedData = useDataStore(state => state.processedData);

  if (!processedData) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-[#0a0118]">
      {/* Header */}
      <header className="border-b border-indigo-500/10 bg-[#0a0118]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-indigo-500" />
            <h1 className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              DataAnalytics
            </h1>
          </div>
          <FileUpload />
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative border-b border-indigo-500/10 bg-[#0a0118] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
        </div>
        
        <div className="container relative py-12">
          <DataSummary />
        </div>
      </div>

      <main className="container py-8 space-y-8">
        {/* Analytics Dashboard */}
        <div className="space-y-8">
          {/* Default Visualizations */}
          <DefaultVisualizations />

          {/* Data Preview */}
          <div className="rounded-2xl border border-indigo-500/10 bg-white/5 backdrop-blur-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Data Preview</h3>
                <p className="text-sm text-white/50">Browse and search through your dataset</p>
              </div>
              <Table2 className="h-5 w-5 text-indigo-400" />
            </div>
            <DataTable />
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      <DataChat />

      <footer className="border-t border-indigo-500/10 py-6 bg-[#0a0118]/50 backdrop-blur-xl">
        <div className="container flex justify-between items-center">
          <p className="text-sm text-white/50">
            © 2024 DataAnalytics. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;