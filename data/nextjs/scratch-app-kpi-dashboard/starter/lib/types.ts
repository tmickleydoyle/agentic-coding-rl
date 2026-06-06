export type MetricCategory = "Growth" | "Revenue" | "Engagement" | "Ops";
export type MetricUnit = "number" | "percent" | "currency";
export type MetricStatus = "On Track" | "At Risk" | "Off Track";
export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

export interface Metric {
  id: string;
  name: string;
  category: MetricCategory;
  unit: MetricUnit;
  currentValue: number;
  targetValue: number;
}

export interface Goal {
  id: string;
  metricId: string;
  quarter: Quarter;
  year: number;
  targetValue: number;
}

export interface HistoryEntry {
  id: string;
  metricId: string;
  value: number;
  date: string;
}
