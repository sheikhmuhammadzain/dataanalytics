import React, { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterPlot,
  Scatter,
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

export const DataVisualizations: React.FC = () => {
  const processedData = useDataStore(state => state.processedData);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'scatter'>('bar');

  if (!processedData?.rows.length) return null;

  const { rows, summary } = processedData;
  const { numericalColumns, categoricalColumns } = summary;

  if (numericalColumns.length < 1) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No numerical data available for visualization
      </div>
    );
  }

  const renderChart = () => {
    const data = rows.slice(0, 50);

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={categoricalColumns[0]} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={selectedMetric || numericalColumns[0]} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={categoricalColumns[0]} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={selectedMetric || numericalColumns[0]}
                stroke="#8884d8"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        const pieData = data
          .reduce((acc, curr) => {
            const key = curr[categoricalColumns[0]];
            const value = Number(curr[selectedMetric || numericalColumns[0]]);
            const existing = acc.find(item => item.name === key);
            if (existing) {
              existing.value += value;
            } else {
              acc.push({ name: key, value });
            }
            return acc;
          }, [] as Array<{ name: string; value: number }>)
          .slice(0, 5);

        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={numericalColumns[0]} />
              <YAxis dataKey={selectedMetric || numericalColumns[1]} />
              <Tooltip />
              <Scatter data={data} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Metric</option>
            {numericalColumns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as any)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="scatter">Scatter Plot</option>
          </select>
        </div>
        {renderChart()}
      </div>
    </div>
  );
};