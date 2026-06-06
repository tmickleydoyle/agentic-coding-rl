export type VolunteerStatus = "Active" | "Inactive";
export type AssignmentStatus = "Pending" | "Completed";

export interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  status: VolunteerStatus;
}

export interface Assignment {
  id: string;
  volunteerId: string;
  title: string;
  date: string;
  status: AssignmentStatus;
}
