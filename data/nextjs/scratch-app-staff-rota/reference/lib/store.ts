import { StaffMember, Shift, Request } from './types'

const seedStaff: StaffMember[] = [
  { id: 'st1', name: 'Emma Wilson', email: 'emma@company.com', role: 'Manager', department: 'Operations' },
  { id: 'st2', name: 'Liam Johnson', email: 'liam@company.com', role: 'Associate', department: 'Sales' },
  { id: 'st3', name: 'Olivia Brown', email: 'olivia@company.com', role: 'Associate', department: 'Support' },
  { id: 'st4', name: 'Noah Davis', email: 'noah@company.com', role: 'Senior', department: 'Operations' },
  { id: 'st5', name: 'Ava Martinez', email: 'ava@company.com', role: 'Associate', department: 'Sales' },
]

const seedShifts: Shift[] = [
  { id: 'sh1', staffId: 'st1', date: '2024-06-10', startTime: '09:00', endTime: '17:00', role: 'Manager' },
  { id: 'sh2', staffId: 'st2', date: '2024-06-10', startTime: '08:00', endTime: '16:00', role: 'Associate' },
  { id: 'sh3', staffId: 'st3', date: '2024-06-11', startTime: '12:00', endTime: '20:00', role: 'Associate' },
  { id: 'sh4', staffId: 'st4', date: '2024-06-11', startTime: '09:00', endTime: '17:00', role: 'Senior' },
  { id: 'sh5', staffId: 'st1', date: '2024-06-12', startTime: '09:00', endTime: '17:00', role: 'Manager' },
  { id: 'sh6', staffId: 'st5', date: '2024-06-12', startTime: '14:00', endTime: '22:00', role: 'Associate' },
]

const seedRequests: Request[] = [
  { id: 'r1', staffId: 'st2', startDate: '2024-06-20', endDate: '2024-06-21', reason: 'Family event', status: 'pending' },
  { id: 'r2', staffId: 'st3', startDate: '2024-07-01', endDate: '2024-07-05', reason: 'Holiday', status: 'approved' },
  { id: 'r3', staffId: 'st5', startDate: '2024-06-15', endDate: '2024-06-15', reason: 'Medical', status: 'pending' },
]

let staff: StaffMember[] = seedStaff.map(s => ({ ...s }))
let shifts: Shift[] = seedShifts.map(s => ({ ...s }))
let requests: Request[] = seedRequests.map(r => ({ ...r }))
let nextId = 100

export function __reset() {
  staff = seedStaff.map(s => ({ ...s }))
  shifts = seedShifts.map(s => ({ ...s }))
  requests = seedRequests.map(r => ({ ...r }))
  nextId = 100
}

export function getStaff(): StaffMember[] { return staff }
export function addStaff(data: Omit<StaffMember, 'id'>): StaffMember {
  const s: StaffMember = { ...data, id: `st${nextId++}` }
  staff.push(s)
  return s
}

export function getShifts(): Shift[] { return shifts }
export function addShift(data: Omit<Shift, 'id'>): Shift {
  const s: Shift = { ...data, id: `sh${nextId++}` }
  shifts.push(s)
  return s
}

export function getRequests(): Request[] { return requests }
export function addRequest(data: Omit<Request, 'id' | 'status'>): Request {
  const r: Request = { ...data, id: `r${nextId++}`, status: 'pending' }
  requests.push(r)
  return r
}
export function updateRequestStatus(id: string, status: 'approved' | 'denied'): Request | null {
  const r = requests.find(x => x.id === id)
  if (!r) return null
  r.status = status
  return r
}
