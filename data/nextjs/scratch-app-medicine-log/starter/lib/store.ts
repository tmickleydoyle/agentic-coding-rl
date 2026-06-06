import { Medicine, LogEntry } from './types'
export function getMedicines(): Medicine[] { return [] }
export function addMedicine(_d: Omit<Medicine,'id'>): Medicine { return { id:'',name:'',dosage:'',frequency:'daily',notes:'' } }
export function deleteMedicine(_id: string): boolean { return false }
export function getLogEntries(): LogEntry[] { return [] }
export function addLogEntry(_d: Omit<LogEntry,'id'>): LogEntry { return { id:'',medicineId:'',medicineName:'',datetime:'',notes:'' } }
export function __reset() {}
