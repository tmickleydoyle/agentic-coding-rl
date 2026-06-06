export type ExperimentStatus = "planned" | "running" | "completed" | "failed";
export type EquipmentStatus = "available" | "in-use" | "maintenance";

export interface Experiment {
  id: string;
  title: string;
  hypothesis: string;
  subject: string;
  status: ExperimentStatus;
  startDate: string;
  endDate: string;
  observations: string;
  conclusion: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  quantity: number;
  status: EquipmentStatus;
  location: string;
}

export interface LabResult {
  id: string;
  experimentId: string;
  experimentTitle: string;
  measurement: string;
  value: number;
  unit: string;
  recordedAt: string;
}

export type Route = "home" | "experiments" | "equipment" | "results";
