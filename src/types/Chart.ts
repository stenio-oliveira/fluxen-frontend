export type TimeRange = '5min' | '15min' | '30min' | '1h' | '6h' | '24h' | '7d';

export type ChartType = 'line' | 'doughnut' | 'bar';

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
  metadata: {
    metrica: {
      id: number;
      nome: string;
      unidade: string;
    };
    timeRange?: TimeRange;
    total?: number;
    currentValue?: number;
    maxValue?: number;
    minValue?: number;
  };
}

