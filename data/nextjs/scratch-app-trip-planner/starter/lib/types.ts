export type TripStatus = "planned" | "active" | "done";

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  notes: string;
}
