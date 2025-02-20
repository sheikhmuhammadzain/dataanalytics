import React from 'react';
import { FileText, BarChart2, ArrowRight } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { useDataStore } from '../store/dataStore';

export const LandingPage: React.FC = () => {
  const processedData = useDataStore(state => state.processedData);

  if (processedData) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-6 w-6" />
            <span className="font-bold text-xl">AwaisAnalytics</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:underline">
              Features
            </a>
            <a href="#about" className="text-sm font-medium hover:underline">
              About
            </a>
            <a
              href="https://github.com/yourusername/awais-analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:underline"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="container py-24 space-y-12">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Build Live Reports and Dashboards with your{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                CSV Data
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Automatically build dashboards and reports using CSV data and our intelligent analytics platform.
              Powered by AI for deeper insights.
            </p>
          </div>

          <div className="space-y-4">
            <FileUpload />
            <div className="flex gap-4 items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowRight className="h-4 w-4" />
                <span>Start analyzing instantly</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <div className="rounded-lg border bg-card p-6">
              <div className="space-y-2">
                <h3 className="font-semibold">AI-Powered Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Get intelligent insights and recommendations from your data using advanced AI.
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Interactive Visualizations</h3>
                <p className="text-sm text-muted-foreground">
                  Create beautiful, interactive charts and graphs from your CSV data.
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Real-time Updates</h3>
                <p className="text-sm text-muted-foreground">
                  See your data updates in real-time with live dashboard refresh.
                </p>
              </div>
            </div>
          </div>
        </section>
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
}; 