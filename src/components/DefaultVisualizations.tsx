import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useDataStore } from '../store/dataStore';
import { mean, median, deviation, extent, quantile, bin } from 'd3-array';
import { 
  BarChart2, 
  LineChart, 
  PieChart, 
  Activity, 
  ScatterChart, 
  BoxPlot,
  ArrowUpDown
} from 'lucide-react';

const COLORS = [
  '#6366f1', // indigo-500
  '#a855f7', // purple-500
  '#ec4899', // pink-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
];

interface ChartCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, description, icon, children }) => (
  <div className="flex flex-col h-full rounded-2xl border border-indigo-500/10 bg-white/5 backdrop-blur-lg overflow-hidden">
    <div className="flex items-center justify-between p-6 border-b border-indigo-500/10">
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold text-white/90">{title}</h3>
        <p className="text-sm text-white/50 leading-tight">{description}</p>
      </div>
      <div className="flex-shrink-0">
        {icon}
      </div>
    </div>
    <div className="flex-1 p-6 pt-4">
      {children}
    </div>
  </div>
);

export const DefaultVisualizations: React.FC = () => {
  const processedData = useDataStore(state => state.processedData);

  const defaultConfig = useMemo(() => ({
    displayModeBar: false,
    responsive: true,
  }), []);

  const defaultLayout = useMemo(() => ({
    font: { family: 'Inter, sans-serif', color: '#ffffff99' },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    margin: { t: 20, r: 10, b: 40, l: 60 },
    showlegend: true,
    legend: { font: { color: '#ffffff99' } },
    xaxis: {
      gridcolor: '#ffffff1a',
      zerolinecolor: '#ffffff33',
      tickfont: { color: '#ffffff99' },
    },
    yaxis: {
      gridcolor: '#ffffff1a',
      zerolinecolor: '#ffffff33',
      tickfont: { color: '#ffffff99' },
    },
    height: 300,
  }), []);

  const chartData = useMemo(() => {
    if (!processedData?.rows?.length) return null;

    const numericColumns = processedData.summary.numericalColumns;
    if (numericColumns.length === 0) return null;

    const primaryColumn = numericColumns[0];
    const values = processedData.rows
      .map(row => Number(row[primaryColumn]))
      .filter(v => !isNaN(v));

    // Calculate basic statistics
    const stats = {
      mean: mean(values) || 0,
      median: median(values) || 0,
      q1: quantile(values, 0.25) || 0,
      q3: quantile(values, 0.75) || 0,
      stdDev: deviation(values) || 0,
    };

    // Create histogram bins
    const binGenerator = bin().domain(extent(values) as [number, number]).thresholds(20);
    const bins = binGenerator(values);
    const histogramData = bins.map(bin => ({
      x: (bin.x0! + bin.x1!) / 2,
      y: bin.length,
    }));

    // Time series data (if available)
    const timeColumn = processedData.headers.find(h => 
      h.toLowerCase().includes('date') || h.toLowerCase().includes('time')
    );
    const timeSeriesData = timeColumn ? processedData.rows
      .map(row => ({
        x: new Date(row[timeColumn]),
        y: Number(row[primaryColumn]),
      }))
      .filter(d => !isNaN(d.y) && !isNaN(d.x.getTime()))
      .sort((a, b) => a.x.getTime() - b.x.getTime()) : null;

    // Category data
    const categoryColumn = processedData.summary.categoricalColumns[0];
    const categoryData = categoryColumn ? 
      Object.entries(
        processedData.rows.reduce((acc, row) => {
          const cat = String(row[categoryColumn]);
          acc[cat] = (acc[cat] || 0) + Number(row[primaryColumn]) || 0;
          return acc;
        }, {} as Record<string, number>)
      ) : null;

    // Correlation data
    const correlationData = numericColumns.length > 1 ? {
      x: processedData.rows.map(row => Number(row[numericColumns[0]])),
      y: processedData.rows.map(row => Number(row[numericColumns[1]])),
    } : null;

    return {
      primaryColumn,
      values,
      stats,
      histogramData,
      timeSeriesData,
      categoryData,
      correlationData,
    };
  }, [processedData]);

  if (!chartData) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
      {/* Distribution Analysis */}
      <ChartCard
        title="Distribution Analysis"
        description="Statistical distribution and density"
        icon={<Activity className="h-5 w-5 text-indigo-400" />}
      >
        <Plot
          data={[{
            type: 'violin',
            x: chartData.values,
            name: chartData.primaryColumn,
            box: { visible: true },
            meanline: { visible: true },
            line: { color: COLORS[0] },
          }]}
          layout={{ ...defaultLayout }}
          config={defaultConfig}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
      </ChartCard>

      {/* Time Series Analysis */}
      <ChartCard
        title="Time Series Analysis"
        description="Trends over time"
        icon={<LineChart className="h-5 w-5 text-indigo-400" />}
      >
        {chartData.timeSeriesData ? (
          <Plot
            data={[{
              type: 'scatter',
              mode: 'lines',
              x: chartData.timeSeriesData.map(d => d.x),
              y: chartData.timeSeriesData.map(d => d.y),
              line: { color: COLORS[1] },
            }]}
            layout={{ ...defaultLayout }}
            config={defaultConfig}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler
          />
        ) : (
          <div className="h-[300px] flex items-center justify-center text-white/50">
            No time series data available
          </div>
        )}
      </ChartCard>

      {/* Category Comparison */}
      <ChartCard
        title="Category Comparison"
        description="Values across categories"
        icon={<BarChart2 className="h-5 w-5 text-indigo-400" />}
      >
        {chartData.categoryData ? (
          <Plot
            data={[{
              type: 'bar',
              x: chartData.categoryData.map(([cat]) => cat),
              y: chartData.categoryData.map(([, val]) => val),
              marker: { color: COLORS[2] },
            }]}
            layout={{ ...defaultLayout, barmode: 'group' }}
            config={defaultConfig}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler
          />
        ) : (
          <div className="h-[300px] flex items-center justify-center text-white/50">
            No categorical data available
          </div>
        )}
      </ChartCard>

      {/* Correlation Analysis */}
      <ChartCard
        title="Correlation Analysis"
        description="Relationship between variables"
        icon={<ScatterChart className="h-5 w-5 text-indigo-400" />}
      >
        {chartData.correlationData ? (
          <Plot
            data={[{
              type: 'scatter',
              mode: 'markers',
              x: chartData.correlationData.x,
              y: chartData.correlationData.y,
              marker: { color: COLORS[3] },
            }]}
            layout={{ ...defaultLayout }}
            config={defaultConfig}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler
          />
        ) : (
          <div className="h-[300px] flex items-center justify-center text-white/50">
            Insufficient numerical columns for correlation
          </div>
        )}
      </ChartCard>

      {/* Proportional Analysis */}
      <ChartCard
        title="Proportional Analysis"
        description="Distribution across categories"
        icon={<PieChart className="h-5 w-5 text-indigo-400" />}
      >
        {chartData.categoryData ? (
          <Plot
            data={[{
              type: 'pie',
              labels: chartData.categoryData.map(([cat]) => cat),
              values: chartData.categoryData.map(([, val]) => val),
              marker: { colors: COLORS },
            }]}
            layout={{ ...defaultLayout }}
            config={defaultConfig}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler
          />
        ) : (
          <div className="h-[300px] flex items-center justify-center text-white/50">
            No categorical data available
          </div>
        )}
      </ChartCard>

      {/* Outlier Detection */}
      <ChartCard
        title="Outlier Detection"
        description="Identify anomalies in data"
        icon={<ArrowUpDown className="h-5 w-5 text-indigo-400" />}
      >
        <Plot
          data={[{
            type: 'box',
            y: chartData.values,
            name: chartData.primaryColumn,
            boxpoints: 'outliers',
            marker: { color: COLORS[5] },
          }]}
          layout={{ ...defaultLayout }}
          config={defaultConfig}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
      </ChartCard>
    </div>
  );
}; 