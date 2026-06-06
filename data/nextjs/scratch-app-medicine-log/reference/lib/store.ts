import { Medicine, LogEntry } from './types'

let medicines: Medicine[] = [
  { id: 'm1', name: 'Aspirin', dosage: '100mg', frequency: 'daily', notes: 'Take with food' },
  { id: 'm2', name: 'Metformin', dosage: '500mg', frequency: 'twice daily', notes: 'Take with meals' },
  { id: 'm3', name: 'Vitamin D', dosage: '1000IU', frequency: 'weekly', notes: 'Take in the morning' },
]

let logEntries: LogEntry[] = [
  { id: 'l1', medicineId: 'm1', medicineName: 'Aspirin', datetime: '2024-06-10T08:00', notes: 'Taken with breakfast' },
  { id: 'l2', medicineId: 'm2', medicineName: 'Metformin', datetime: '2024-06-10T07:30', notes: 'Morning dose' },
]

let nextId = 100

function uid() { return String(++nextId) }

export function getMedicines() { return [...medicines] }
export function addMedicine(data: Omit<Medicine, 'id'>): Medicine {
  const m: Medicine = { id: uid(), ...data }
  medicines.push(m)
  return m
}
export function deleteMedicine(id: string): boolean {
  const len = medicines.length
  medicines = medicines.filter(m => m.id !== id)
  return medicines.length < len
}

export function getLogEntries() { return [...logEntries] }
export function addLogEntry(data: Omit<LogEntry, 'id'>): LogEntry {
  const e: LogEntry = { id: uid(), ...data }
  logEntries.push(e)
  return e
}

export function __reset() {
  medicines = [
    { id: 'm1', name: 'Aspirin', dosage: '100mg', frequency: 'daily', notes: 'Take with food' },
    { id: 'm2', name: 'Metformin', dosage: '500mg', frequency: 'twice daily', notes: 'Take with meals' },
    { id: 'm3', name: 'Vitamin D', dosage: '1000IU', frequency: 'weekly', notes: 'Take in the morning' },
  ]
  logEntries = [
    { id: 'l1', medicineId: 'm1', medicineName: 'Aspirin', datetime: '2024-06-10T08:00', notes: 'Taken with breakfast' },
    { id: 'l2', medicineId: 'm2', medicineName: 'Metformin', datetime: '2024-06-10T07:30', notes: 'Morning dose' },
  ]
  nextId = 100
}
