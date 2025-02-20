import React, { useMemo, useState } from 'react';
import { useDataStore } from '../store/dataStore';
import Plot from 'react-plotly.js';
import { extent, mean, median, quantile, deviation } from 'd3-array';

const COLORS = [
  '#2563eb', // blue-600
  '#16a34a', // green-600
  '#dc2626', // red-600
  '#ca8a04', // yellow-600
  '#9333ea', // purple-600
  '#c026d3', // fuchsia-600
  '#0891b2', // cyan-600
  '#ea580c', // orange-600
];

type ChartType = 
  | 'distribution' 
  | 'correlation' 
  | '3d-scatter'
  | 'heatmap';

export const DataVisualizations: React.FC = () => {
  const processedData = useDataStore(state => state.processedData);
  const [selectedNumerical, setSelectedNumerical] = useState<string>('');
  const [selectedCategorical, setSelectedCategorical] = useState<string>(''); // if needed later
  const [chartType, setChartType] = useState<ChartType>('distribution');
  const [secondaryNumerical, setSecondaryNumerical] = useState<string>('');

  if (!processedData?.rows.length) return null;
  const { rows, summary } = processedData;
  const { numericalColumns } = summary;

  // Compute tertiary column once for 3D scatter (first column not equal to primary or secondary)
  const tertiaryColumn = useMemo(() => {
    return numericalColumns.find(
      col => col !== selectedNumerical && col !== secondaryNumerical
    ) || numericalColumns[0];
  }, [numericalColumns, selectedNumerical, secondaryNumerical]);

  // Advanced Distribution Analysis
  const distributionData = useMemo(() => {
    if (!selectedNumerical) return null;
    const values = rows
      .map(row => row[selectedNumerical])
      .filter((v): v is number => v !== null);
    const stats = {
      min: Math.min(...values),
      max: Math.max(...values),
      mean: mean(values),
      median: median(values),
      q1: quantile(values, 0.25),
      q3: quantile(values, 0.75),
      stdDev: deviation(values),
      skewness: calculateSkewness(values),
      kurtosis: calculateKurtosis(values),
    };
    const kde = calculateKDE(values);
    return { stats, values, kde };
  }, [selectedNumerical, rows]);

  // Advanced Correlation Analysis
  const correlationData = useMemo(() => {
    if (!selectedNumerical || numericalColumns.length < 2) return null;
    // Cache primary values so we don't recalc for every column
    const primaryValues = rows
      .map(row => row[selectedNumerical])
      .filter((v): v is number => v !== null);

    return numericalColumns.map(col => {
      const yValues = rows
        .map(row => row[col])
        .filter((v): v is number => v !== null);
      const pearson = calculatePearsonCorrelation(primaryValues, yValues);
      const spearman = calculateSpearmanCorrelation(primaryValues, yValues);
      // Filter out any points with null values
      const data = rows
        .map(row => ({
          x: row[selectedNumerical],
          y: row[col],
        }))
        .filter(point => point.x !== null && point.y !== null);
      return { column: col, pearson, spearman, data };
    });
  }, [selectedNumerical, rows, numericalColumns]);

  // 3D Scatter Plot Data
  const threeDScatterData = useMemo(() => {
    if (!selectedNumerical || !secondaryNumerical || numericalColumns.length < 3) return null;
    return rows.map(row => ({
      x: row[selectedNumerical],
      y: row[secondaryNumerical],
      z: row[tertiaryColumn],
    }));
  }, [selectedNumerical, secondaryNumerical, rows, tertiaryColumn, numericalColumns]);

  // Heatmap Correlation Matrix
  const correlationMatrix = useMemo(() => {
    return numericalColumns.map(col1 => 
      numericalColumns.map(col2 => {
        const xValues = rows.map(row => row[col1]);
        const yValues = rows.map(row => row[col2]);
        return calculatePearsonCorrelation(
          xValues.filter((v): v is number => v !== null),
          yValues.filter((v): v is number => v !== null)
        );
      })
    );
  }, [rows, numericalColumns]);

  // Memoize layout objects to avoid unnecessary re-renders in Plotly
  const distributionLayout = useMemo(() => ({
    title: `Distribution Analysis: ${selectedNumerical}`,
    xaxis: { title: selectedNumerical },
    yaxis: { title: 'Density' },
    showlegend: true,
  }), [selectedNumerical]);

  const renderChart = () => {
    switch (chartType) {
      case 'distribution': {
        if (!distributionData) return null;
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-lg border bg-card p-4">
                <h4 className="text-sm font-medium mb-2">Advanced Statistics</h4>
                <dl className="space-y-1">
                  {Object.entries(distributionData.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="text-sm text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </dt>
                      <dd className="text-sm font-medium">
                        {typeof value === 'number' ? value.toFixed(3) : '-'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className="h-[400px]">
              <Plot
                data={[
                  {
                    type: 'violin',
                    x: distributionData.values,
                    name: selectedNumerical,
                    box: { visible: true },
                    meanline: { visible: true },
                    points: 'all',
                  },
                  {
                    type: 'scatter',
                    x: distributionData.kde.x,
                    y: distributionData.kde.y,
                    name: 'KDE',
                    line: { color: COLORS[1] },
                  },
                ]}
                layout={distributionLayout}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        );
      }
      case 'correlation': {
        if (!correlationData) return null;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {correlationData.map(({ column, data, pearson, spearman }, index) => {
              const xValues = data.map(d => d.x);
              const yValues = data.map(d => d.y);
              // Compute regression line endpoints
              const [xMin, xMax] = [Math.min(...xValues), Math.max(...xValues)];
              const regressionY = calculateRegressionLine(data);
              const layout = {
                title: `Correlation: ${selectedNumerical} vs ${column}<br>Pearson: ${pearson.toFixed(3)}, Spearman: ${spearman.toFixed(3)}`,
                xaxis: { title: selectedNumerical },
                yaxis: { title: column },
                showlegend: true,
              };
              return (
                <div key={column} className="h-[400px]">
                  <Plot
                    data={[
                      {
                        type: 'scatter',
                        mode: 'markers',
                        x: xValues,
                        y: yValues,
                        name: `${selectedNumerical} vs ${column}`,
                        marker: { color: COLORS[index % COLORS.length] },
                      },
                      {
                        type: 'scatter',
                        mode: 'lines',
                        x: [xMin, xMax],
                        y: regressionY,
                        name: 'Regression Line',
                        line: { color: COLORS[(index + 1) % COLORS.length] },
                      },
                    ]}
                    layout={layout}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              );
            })}
          </div>
        );
      }
      case '3d-scatter': {
        if (!threeDScatterData) return null;
        const layout = {
          title: '3D Scatter Plot',
          scene: {
            xaxis: { title: selectedNumerical },
            yaxis: { title: secondaryNumerical },
            zaxis: { title: tertiaryColumn },
          },
        };
        return (
          <div className="h-[600px]">
            <Plot
              data={[
                {
                  type: 'scatter3d',
                  mode: 'markers',
                  x: threeDScatterData.map(d => d.x),
                  y: threeDScatterData.map(d => d.y),
                  z: threeDScatterData.map(d => d.z),
                  marker: {
                    size: 5,
                    color: threeDScatterData.map(d => d.x),
                    colorscale: 'Viridis',
                  },
                },
              ]}
              layout={layout}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        );
      }
      case 'heatmap': {
        const layout = {
          title: 'Correlation Matrix Heatmap',
          xaxis: { side: 'bottom' },
          yaxis: { autorange: 'reversed' },
        };
        return (
          <div className="h-[600px]">
            <Plot
              data={[
                {
                  type: 'heatmap',
                  z: correlationMatrix,
                  x: numericalColumns,
                  y: numericalColumns,
                  colorscale: 'RdBu',
                  zmin: -1,
                  zmax: 1,
                  text: correlationMatrix.map(row => row.map(val => val.toFixed(3))),
                  texttemplate: '%{text}',
                  textfont: { size: 10 },
                  hoverongaps: false,
                },
              ]}
              layout={layout}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Analysis Type</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="distribution">Distribution Analysis</option>
            <option value="correlation">Correlation Analysis</option>
            <option value="3d-scatter">3D Scatter Plot</option>
            <option value="heatmap">Correlation Heatmap</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Primary Numerical Column</label>
          <select
            value={selectedNumerical}
            onChange={(e) => setSelectedNumerical(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select column...</option>
            {numericalColumns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        {chartType === '3d-scatter' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Secondary Numerical Column</label>
            <select
              value={secondaryNumerical}
              onChange={(e) => setSecondaryNumerical(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select column...</option>
              {numericalColumns
                .filter(col => col !== selectedNumerical)
                .map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
            </select>
          </div>
        )}
      </div>
      {renderChart()}
    </div>
  );
};

// Statistical utility functions (remain outside the component)
function calculateSkewness(values: number[]): number {
  const n = values.length;
  const meanVal = mean(values) || 0;
  const stdDev = deviation(values) || 1;
  const cubedDeviations = values.map(x => Math.pow((x - meanVal) / stdDev, 3));
  return (n / ((n - 1) * (n - 2))) * sum(cubedDeviations);
}

function calculateKurtosis(values: number[]): number {
  const n = values.length;
  const meanVal = mean(values) || 0;
  const stdDev = deviation(values) || 1;
  const fourthDeviations = values.map(x => Math.pow((x - meanVal) / stdDev, 4));
  return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum(fourthDeviations) -
         (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
}

function calculateKDE(values: number[]): { x: number[]; y: number[] } {
  const bw = 0.9 * (deviation(values) || 1) * Math.pow(values.length, -0.2);
  const [minVal, maxVal] = extent(values) as [number, number];
  const step = (maxVal - minVal) / 100;
  const x = Array.from({ length: 101 }, (_, i) => minVal + i * step);
  const y = x.map(xi => mean(values.map(v => gaussian(xi - v, bw))) || 0);
  return { x, y };
}

function gaussian(x: number, bw: number): number {
  return (1 / (bw * Math.sqrt(2 * Math.PI))) * Math.exp(-(x * x) / (2 * bw * bw));
}

function calculatePearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const meanX = mean(x) || 0;
  const meanY = mean(y) || 0;
  const stdDevX = deviation(x) || 1;
  const stdDevY = deviation(y) || 1;
  const covariance = sum(x.map((xi, i) => (xi - meanX) * (y[i] - meanY))) / (n - 1);
  return covariance / (stdDevX * stdDevY);
}

function calculateSpearmanCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const xRanks = calculateRanks(x);
  const yRanks = calculateRanks(y);
  const diffSquared = sum(xRanks.map((r, i) => Math.pow(r - yRanks[i], 2)));
  return 1 - (6 * diffSquared) / (n * (n * n - 1));
}

function calculateRanks(values: number[]): number[] {
  return values
    .map((v, i) => ({ value: v, index: i }))
    .sort((a, b) => a.value - b.value)
    .map((v, i) => ({ ...v, rank: i + 1 }))
    .sort((a, b) => a.index - b.index)
    .map(v => v.rank);
}

function calculateRegressionLine(data: { x: number; y: number }[]): number[] {
  const xVals = data.map(d => d.x);
  const yVals = data.map(d => d.y);
  const meanX = mean(xVals) || 0;
  const meanY = mean(yVals) || 0;
  const slope = sum(xVals.map((xi, i) => (xi - meanX) * (yVals[i] - meanY))) /
                sum(xVals.map(xi => Math.pow(xi - meanX, 2)));
  const intercept = meanY - slope * meanX;
  const [xMin, xMax] = [Math.min(...xVals), Math.max(...xVals)];
  return [slope * xMin + intercept, slope * xMax + intercept];
}

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}
