import { create } from 'zustand';
import { DataRow, DataStore, ProcessedData, ColumnStats } from '../types/data';

const calculateStats = (data: (string | number | null)[], isNumeric: boolean): ColumnStats => {
  // Filter out null/undefined values and convert to strings for counting
  const cleanData = data.filter(val => val !== null && val !== undefined);
  const stringData = cleanData.map(val => String(val));

  const stats: ColumnStats = {
    uniqueValues: new Set(stringData).size,
    mostCommon: Object.entries(
      stringData.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([value, count]) => ({ value, count }))
  };

  if (isNumeric) {
    const numericData = cleanData
      .map(v => (typeof v === 'number' ? v : Number(v)))
      .filter(v => !isNaN(v));

    if (numericData.length > 0) {
      numericData.sort((a, b) => a - b);
      stats.min = Math.min(...numericData);
      stats.max = Math.max(...numericData);
      stats.mean = numericData.reduce((a, b) => a + b, 0) / numericData.length;
      stats.median = numericData[Math.floor(numericData.length / 2)];
    }
  }

  return stats;
};

export const useDataStore = create<DataStore>((set, get) => ({
  rawData: [],
  processedData: null,
  selectedColumns: [],
  filterValue: '',

  setSelectedColumns: (columns: string[]) => set({ selectedColumns: columns }),
  setFilterValue: (value: string) => set({ filterValue: value }),

  setRawData: (data: DataRow[]) => {
    // Filter out empty rows
    const cleanData = data.filter(row => {
      return Object.values(row).some(value => 
        value !== null && 
        value !== undefined && 
        value !== '' && 
        !(typeof value === 'string' && value.trim() === '')
      );
    });

    if (cleanData.length === 0) {
      console.error('No valid data found in CSV');
      return;
    }

    set({ rawData: cleanData });
    get().processData();
  },

  getFilteredData: () => {
    const { processedData, filterValue } = get();
    if (!processedData) return [];

    if (!filterValue.trim()) return processedData.rows;

    const searchTerm = filterValue.toLowerCase();
    return processedData.rows.filter(row => 
      Object.entries(row).some(([_, value]) => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm);
      })
    );
  },

  processData: () => {
    const rawData = get().rawData;
    if (!rawData.length) return;

    const headers = Object.keys(rawData[0]);
    const numericalColumns: string[] = [];
    const categoricalColumns: string[] = [];
    const columnStats: Record<string, ColumnStats> = {};

    // Identify column types and calculate statistics
    headers.forEach(header => {
      const values = rawData.map(row => row[header]);
      
      // Check if column is numeric by testing all non-null values
      const isNumeric = values.every(val => 
        val === null || 
        val === undefined || 
        val === '' || 
        (typeof val === 'number' || !isNaN(Number(val)))
      );
      
      if (isNumeric) {
        numericalColumns.push(header);
      } else {
        categoricalColumns.push(header);
      }

      columnStats[header] = calculateStats(values, isNumeric);
    });

    // Process numerical values
    const rows = rawData.map(row => {
      const processedRow = { ...row };
      numericalColumns.forEach(col => {
        const value = row[col];
        processedRow[col] = value === null || value === undefined || value === '' 
          ? null 
          : Number(value);
      });
      return processedRow;
    });

    const processedData: ProcessedData = {
      headers,
      rows,
      summary: {
        numericalColumns,
        categoricalColumns,
        rowCount: rows.length,
        columnCount: headers.length,
        columnStats,
      },
    };

    set({ processedData, selectedColumns: headers });
  },
}));