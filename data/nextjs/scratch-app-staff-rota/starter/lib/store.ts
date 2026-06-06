import { StaffMember, Shift, Request } from './types'

export function __reset() {}
export function getStaff(): StaffMember[] { return [] }
export function addStaff(_d: Omit<StaffMember, 'id'>): StaffMember { return {} as StaffMember }
export function getShifts(): Shift[] { return [] }
export function addShift(_d: Omit<Shift, 'id'>): Shift { return {} as Shift }
export function getRequests(): Request[] { return [] }
export function addRequest(_d: Omit<Request, 'id' | 'status'>): Request { return {} as Request }
export function updateRequestStatus(_id: string, _status: 'approved' | 'denied'): Request | null { return null }
