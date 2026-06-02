export type Route = 'classes' | 'bookings' | 'roster' | 'settings'
export type FitnessClass = { id: number; name: string; capacity: number }
export type Booking = { id: number; classId: number; member: string; waitlisted: boolean }
