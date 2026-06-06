export interface EventLog {
  id: string;
  name: string;
  sessionId: string;
  properties: Record<string, string>;
  timestamp: string;
  createdAt: number;
}

export interface Funnel {
  id: string;
  name: string;
  steps: string[];
  createdAt: number;
}

export interface Segment {
  id: string;
  name: string;
  eventName: string;
  minOccurrences: number;
  createdAt: number;
}

export type Route = "overview" | "events" | "funnels" | "segments";
