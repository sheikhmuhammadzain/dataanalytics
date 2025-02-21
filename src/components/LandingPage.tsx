"use client";
import React from 'react';
import { FileText, BarChart2, ArrowRight, LineChart, PieChart, Sparkles } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { useDataStore } from '../store/dataStore';
import { Spotlight } from './Spotlight';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const LandingPage: React.FC = () => {
  const processedData = useDataStore(state => state.processedData);

  if (processedData) return null;

  return (
    <div className="min-h-screen bg-black relative flex flex-col overflow-hidden">
      {/* Spotlight Effect */}
      <Spotlight />

      {/* Modern gradient background with beam effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <header className="relative border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-indigo-500" />
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              DataAnalytics
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <a
              href="https://github.com/yourusername/Data-analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="relative flex-1 flex items-center">
        <div className="container py-24">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={stagger}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div 
              variants={fadeIn}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-white">
                  Transform Your Data into{' '}
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Powerful Insights
                  </span>
                </h1>
                <p className="text-xl text-white/70 max-w-xl">
                  Upload your CSV data and instantly get AI-powered analytics, beautiful visualizations, and deep insights.
                </p>
              </div>

              <div className="flex flex-col items-center max-w-md space-y-6">
                <FileUpload />
                <div className="flex gap-6 items-center text-sm text-white/50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span>AI-Powered Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-indigo-400" />
                    <span>Interactive Charts</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature preview cards */}
            <motion.div 
              variants={fadeIn}
              className="relative hidden lg:block"
            >
              <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
              <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
              
              <div className="relative space-y-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
                >
                  <div className="flex items-center gap-3 text-white/70">
                    <LineChart className="h-5 w-5 text-indigo-400" />
                    <span className="font-medium">Advanced Analytics</span>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 ml-6"
                >
                  <div className="flex items-center gap-3 text-white/70">
                    <PieChart className="h-5 w-5 text-indigo-400" />
                    <span className="font-medium">Interactive Visualizations</span>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 ml-12"
                >
                  <div className="flex items-center gap-3 text-white/70">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    <span className="font-medium">AI-Powered Insights</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <footer className="relative border-t border-white/10 py-6 bg-black/50 backdrop-blur-xl">
        <div className="container flex justify-between items-center">
          <p className="text-sm text-white/50">
            © 2024 DataAnalytics. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}; 