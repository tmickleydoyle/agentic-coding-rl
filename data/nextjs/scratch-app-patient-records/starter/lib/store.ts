import { Patient, Appointment, MedicalRecord } from './types'

export function getPatients(): Patient[] { return [] }
export function addPatient(_data: Omit<Patient, 'id'>): Patient { return { id: '', name: '', dob: '', gender: '', phone: '' } }
export function getAppointments(): Appointment[] { return [] }
export function addAppointment(_data: Omit<Appointment, 'id'>): Appointment { return { id: '', patientId: '', patientName: '', date: '', time: '', reason: '', status: 'scheduled' } }
export function updateAppointmentStatus(_id: string, _status: Appointment['status']): boolean { return false }
export function getRecords(): MedicalRecord[] { return [] }
export function addRecord(_data: Omit<MedicalRecord, 'id'>): MedicalRecord { return { id: '', patientId: '', patientName: '', date: '', diagnosis: '', notes: '' } }
export function __reset() {}
