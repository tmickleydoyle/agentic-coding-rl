export type Subject = "Math" | "Science" | "English" | "History" | "Computer Science" | "Music" | "Art";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Tutor {
  id: string;
  name: string;
  subjects: Subject[];
  hourlyRate: number;
  rating: number;
  bio: string;
  available: boolean;
}

export interface Booking {
  id: string;
  tutorId: string;
  tutorName: string;
  subject: Subject;
  studentName: string;
  date: string;
  startTime: string;
  durationHours: number;
  status: BookingStatus;
  notes: string;
}

export interface Review {
  id: string;
  tutorId: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export type Route = "home" | "tutors" | "bookings" | "subjects";
