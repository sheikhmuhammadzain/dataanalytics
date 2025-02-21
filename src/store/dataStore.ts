import { create } from "zustand";
import { mean, median, deviation } from "d3-array";

interface ColumnStats {
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  stdDev?: number;
}

interface DataSummary {
  rowCount: number;
  columnCount: number;
  headers: string[];
  numericalColumns: string[];
  categoricalColumns: string[];
  columnStats: Record<string, ColumnStats>;
}

interface ProcessedData {
  rows: Record<string, string | number | null>[];
  headers: string[];
  summary: DataSummary;
}

interface DataStore {
  rawData: Record<string, string | number | null>[] | null;
  processedData: ProcessedData | null;
  filterValue: string;
  selectedColumns: string[];
  setRawData: (data: Record<string, string | number | null>[]) => void;
  setFilterValue: (value: string) => void;
  setSelectedColumns: (columns: string[]) => void;
  getFilteredData: () => Record<string, string | number | null>[];
}

const processData = (
  rawData: Record<string, string | number | null>[]
): ProcessedData | null => {
  if (!rawData || rawData.length === 0) return null;

  // Extract headers from the first row
  const headers = Object.keys(rawData[0]);

  // Determine column types by sampling (first 1,000 rows or less)
  const columnTypes = new Map<string, "numerical" | "categorical">();
  const numericalValues: Record<string, number[]> = {};

  headers.forEach((header) => {
    const sampleSize = Math.min(1000, rawData.length);
    let numericCount = 0;
    for (let i = 0; i < sampleSize; i++) {
      const value = rawData[i][header];
      if (typeof value === "number" && !isNaN(value)) {
        numericCount++;
      }
    }
    if (numericCount >= 0.7 * sampleSize) {
      columnTypes.set(header, "numerical");
      numericalValues[header] = [];
    } else {
      columnTypes.set(header, "categorical");
    }
  });

  // Single pass: accumulate numerical values
  rawData.forEach((row) => {
    headers.forEach((header) => {
      if (columnTypes.get(header) === "numerical") {
        const value = row[header];
        if (typeof value === "number" && !isNaN(value)) {
          numericalValues[header].push(value);
        }
      }
    });
  });

  // Calculate statistics for each numerical column
  const columnStats: Record<string, ColumnStats> = {};
  headers.forEach((header) => {
    if (columnTypes.get(header) === "numerical") {
      const values = numericalValues[header];
      if (values.length > 0) {
        columnStats[header] = {
          min: Math.min(...values),
          max: Math.max(...values),
          mean: mean(values),
          median: median(values),
          stdDev: deviation(values),
        };
      }
    }
  });

  const numericalColumns = headers.filter(
    (h) => columnTypes.get(h) === "numerical"
  );
  const categoricalColumns = headers.filter(
    (h) => columnTypes.get(h) === "categorical"
  );

  return {
    rows: rawData,
    headers,
    summary: {
      rowCount: rawData.length,
      columnCount: headers.length,
      headers,
      numericalColumns,
      categoricalColumns,
      columnStats,
    },
  };
};

export const useDataStore = create<DataStore>((set, get) => ({
  rawData: null,
  processedData: null,
  filterValue: "",
  selectedColumns: [],
  setRawData: (data) => {
    if (!data || data.length === 0) {
      set({ rawData: null, processedData: null, selectedColumns: [] });
      return;
    }

    // Process data asynchronously to prevent blocking the UI
    Promise.resolve().then(() => {
      const processed = processData(data);
      if (processed) {
        set({
          rawData: data,
          processedData: processed,
          selectedColumns: processed.headers,
        });
      }
    });
  },
  setFilterValue: (value) => set({ filterValue: value }),
  setSelectedColumns: (columns) => set({ selectedColumns: columns }),
  getFilteredData: () => {
    const { processedData, filterValue, selectedColumns } = get();
    if (!processedData) return [];

    const searchTerms = filterValue
      .toLowerCase()
      .split(" ")
      .filter(Boolean);
    if (!searchTerms.length) return processedData.rows;

    return processedData.rows.filter((row) =>
      searchTerms.every((term) =>
        selectedColumns.some((col) => {
          const value = row[col];
          if (value == null) return false;
          return String(value).toLowerCase().includes(term);
        })
      )
    );
  },
}));
