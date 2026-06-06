export type ResidentStatus = "Staying" | "Departed";
export type ServiceType = "Meal" | "Counseling" | "Medical" | "Job Aid";
export type Wing = "A" | "B" | "C";

export interface Resident {
  id: string;
  name: string;
  age: number;
  checkIn: string;
  status: ResidentStatus;
}

export interface Bed {
  id: string;
  bedNumber: string;
  wing: Wing;
  occupied: boolean;
  residentId: string | null;
}

export interface ServiceLog {
  id: string;
  residentId: string;
  service: ServiceType;
  date: string;
  notes: string;
}
