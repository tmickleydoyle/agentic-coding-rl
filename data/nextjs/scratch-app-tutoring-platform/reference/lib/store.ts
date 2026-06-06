import type { Tutor, Booking, Review, Subject, BookingStatus } from "./types";

let tutors: Tutor[] = [
  { id: "t1", name: "Dr. Sarah Chen", subjects: ["Math", "Science"], hourlyRate: 75, rating: 4.9, bio: "PhD in Mathematics, 10 years teaching", available: true },
  { id: "t2", name: "James Wilson", subjects: ["English", "History"], hourlyRate: 55, rating: 4.7, bio: "Literature professor with passion for writing", available: true },
  { id: "t3", name: "Maria Santos", subjects: ["Computer Science", "Math"], hourlyRate: 80, rating: 4.8, bio: "Software engineer and coding mentor", available: false },
];

let bookings: Booking[] = [
  { id: "b1", tutorId: "t1", tutorName: "Dr. Sarah Chen", subject: "Math", studentName: "Alex Turner", date: "2024-03-10", startTime: "10:00", durationHours: 1, status: "confirmed", notes: "Calculus review" },
  { id: "b2", tutorId: "t2", tutorName: "James Wilson", subject: "English", studentName: "Jamie Lee", date: "2024-03-12", startTime: "14:00", durationHours: 2, status: "pending", notes: "Essay help" },
];

let reviews: Review[] = [
  { id: "r1", tutorId: "t1", studentName: "Alex Turner", rating: 5, comment: "Excellent explanation!", date: "2024-02-20" },
];

let nextId = 100;

export function getTutors(): Tutor[] { return [...tutors]; }
export function getBookings(): Booking[] { return [...bookings]; }
export function getReviews(): Review[] { return [...reviews]; }
export function getTutorsBySubject(subject: Subject): Tutor[] {
  return tutors.filter(t => t.subjects.includes(subject));
}

export function addTutor(data: Omit<Tutor, "id">): Tutor {
  const t: Tutor = { ...data, id: `t${nextId++}` };
  tutors.push(t);
  return t;
}

export function addBooking(data: Omit<Booking, "id">): Booking {
  const b: Booking = { ...data, id: `b${nextId++}` };
  bookings.push(b);
  return b;
}

export function updateBookingStatus(id: string, status: BookingStatus): Booking | null {
  const b = bookings.find(x => x.id === id);
  if (!b) return null;
  b.status = status;
  return { ...b };
}

export function addReview(data: Omit<Review, "id">): Review {
  const r: Review = { ...data, id: `r${nextId++}` };
  reviews.push(r);
  return r;
}

export function getTutorReviews(tutorId: string): Review[] {
  return reviews.filter(r => r.tutorId === tutorId);
}

export function __reset(): void {
  tutors = [
    { id: "t1", name: "Dr. Sarah Chen", subjects: ["Math", "Science"], hourlyRate: 75, rating: 4.9, bio: "PhD in Mathematics, 10 years teaching", available: true },
    { id: "t2", name: "James Wilson", subjects: ["English", "History"], hourlyRate: 55, rating: 4.7, bio: "Literature professor with passion for writing", available: true },
    { id: "t3", name: "Maria Santos", subjects: ["Computer Science", "Math"], hourlyRate: 80, rating: 4.8, bio: "Software engineer and coding mentor", available: false },
  ];
  bookings = [
    { id: "b1", tutorId: "t1", tutorName: "Dr. Sarah Chen", subject: "Math", studentName: "Alex Turner", date: "2024-03-10", startTime: "10:00", durationHours: 1, status: "confirmed", notes: "Calculus review" },
    { id: "b2", tutorId: "t2", tutorName: "James Wilson", subject: "English", studentName: "Jamie Lee", date: "2024-03-12", startTime: "14:00", durationHours: 2, status: "pending", notes: "Essay help" },
  ];
  reviews = [
    { id: "r1", tutorId: "t1", studentName: "Alex Turner", rating: 5, comment: "Excellent explanation!", date: "2024-02-20" },
  ];
  nextId = 100;
}
