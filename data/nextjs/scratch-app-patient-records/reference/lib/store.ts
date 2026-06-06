import { Patient, Appointment, MedicalRecord } from './types'

let patients: Patient[] = [
  { id: 'p1', name: 'Alice Johnson', dob: '1985-03-12', gender: 'Female', phone: '555-0101' },
  { id: 'p2', name: 'Bob Smith', dob: '1972-07-24', gender: 'Male', phone: '555-0102' },
  { id: 'p3', name: 'Carol White', dob: '1990-11-05', gender: 'Female', phone: '555-0103' },
]

let appointments: Appointment[] = [
  { id: 'a1', patientId: 'p1', patientName: 'Alice Johnson', date: '2024-06-10', time: '09:00', reason: 'Annual Checkup', status: 'scheduled' },
  { id: 'a2', patientId: 'p2', patientName: 'Bob Smith', date: '2024-06-11', time: '14:30', reason: 'Follow-up', status: 'completed' },
]

let records: MedicalRecord[] = [
  { id: 'r1', patientId: 'p1', patientName: 'Alice Johnson', date: '2024-05-01', diagnosis: 'Hypertension', notes: 'Prescribed lisinopril 10mg' },
  { id: 'r2', patientId: 'p2', patientName: 'Bob Smith', date: '2024-04-15', diagnosis: 'Diabetes Type 2', notes: 'Diet and exercise plan recommended' },
]

let nextId = 100

function uid() { return String(++nextId) }

export function getPatients() { return [...patients] }
export function addPatient(data: Omit<Patient, 'id'>): Patient {
  const p: Patient = { id: uid(), ...data }
  patients.push(p)
  return p
}

export function getAppointments() { return [...appointments] }
export function addAppointment(data: Omit<Appointment, 'id'>): Appointment {
  const a: Appointment = { id: uid(), ...data }
  appointments.push(a)
  return a
}
export function updateAppointmentStatus(id: string, status: Appointment['status']): boolean {
  const a = appointments.find(x => x.id === id)
  if (!a) return false
  a.status = status
  return true
}

export function getRecords() { return [...records] }
export function addRecord(data: Omit<MedicalRecord, 'id'>): MedicalRecord {
  const r: MedicalRecord = { id: uid(), ...data }
  records.push(r)
  return r
}

export function __reset() {
  patients = [
    { id: 'p1', name: 'Alice Johnson', dob: '1985-03-12', gender: 'Female', phone: '555-0101' },
    { id: 'p2', name: 'Bob Smith', dob: '1972-07-24', gender: 'Male', phone: '555-0102' },
    { id: 'p3', name: 'Carol White', dob: '1990-11-05', gender: 'Female', phone: '555-0103' },
  ]
  appointments = [
    { id: 'a1', patientId: 'p1', patientName: 'Alice Johnson', date: '2024-06-10', time: '09:00', reason: 'Annual Checkup', status: 'scheduled' },
    { id: 'a2', patientId: 'p2', patientName: 'Bob Smith', date: '2024-06-11', time: '14:30', reason: 'Follow-up', status: 'completed' },
  ]
  records = [
    { id: 'r1', patientId: 'p1', patientName: 'Alice Johnson', date: '2024-05-01', diagnosis: 'Hypertension', notes: 'Prescribed lisinopril 10mg' },
    { id: 'r2', patientId: 'p2', patientName: 'Bob Smith', date: '2024-04-15', diagnosis: 'Diabetes Type 2', notes: 'Diet and exercise plan recommended' },
  ]
  nextId = 100
}
