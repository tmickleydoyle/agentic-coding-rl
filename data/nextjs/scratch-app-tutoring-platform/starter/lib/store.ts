import type { Tutor, Booking, Review, Subject, BookingStatus } from "./types";

export function getTutors(): Tutor[] { return []; }
export function getBookings(): Booking[] { return []; }
export function getReviews(): Review[] { return []; }
export function getTutorsBySubject(_subject: Subject): Tutor[] { return []; }
export function addTutor(_data: Omit<Tutor, "id">): Tutor { throw new Error("Not implemented"); }
export function addBooking(_data: Omit<Booking, "id">): Booking { throw new Error("Not implemented"); }
export function updateBookingStatus(_id: string, _status: BookingStatus): Booking | null { return null; }
export function addReview(_data: Omit<Review, "id">): Review { throw new Error("Not implemented"); }
export function getTutorReviews(_tutorId: string): Review[] { return []; }
export function __reset(): void {}
