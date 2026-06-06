export interface StaffMember {
  id: string
  name: string
  email: string
  role: string
  department: string
}

export interface Shift {
  id: string
  staffId: string
  date: string
  startTime: string
  endTime: string
  role: string
}

export interface Request {
  id: string
  staffId: string
  startDate: string
  endDate: string
  reason: string
  status: 'pending' | 'approved' | 'denied'
}

export type Route = 'home' | 'shifts' | 'staff' | 'requests'
