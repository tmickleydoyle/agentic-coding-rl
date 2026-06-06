import type { Vehicle, ServiceRecord, Reminder } from './types';

let vehicles: Vehicle[] = [
  { id: 'v1', make: 'Toyota', model: 'Camry', year: 2018, mileage: 45000 },
  { id: 'v2', make: 'Honda', model: 'Civic', year: 2020, mileage: 28000 },
];
let serviceRecords: ServiceRecord[] = [
  { id: 's1', vehicleId: 'v1', serviceType: 'Oil Change', date: '2025-09-15', mileageAtService: 44500, cost: 45, notes: 'Synthetic 5W-30' },
  { id: 's2', vehicleId: 'v2', serviceType: 'Tire Rotation', date: '2025-09-20', mileageAtService: 27800, cost: 25, notes: '' },
];
let reminders: Reminder[] = [
  { id: 'r1', vehicleId: 'v1', title: 'Next Oil Change', dueDate: '2026-03-15', dueMileage: 49500, completed: false },
  { id: 'r2', vehicleId: 'v2', title: 'Brake Inspection', dueDate: '2025-06-01', dueMileage: 30000, completed: false },
];
let nextId = 100;

export function __reset() {
  vehicles = [
    { id: 'v1', make: 'Toyota', model: 'Camry', year: 2018, mileage: 45000 },
    { id: 'v2', make: 'Honda', model: 'Civic', year: 2020, mileage: 28000 },
  ];
  serviceRecords = [
    { id: 's1', vehicleId: 'v1', serviceType: 'Oil Change', date: '2025-09-15', mileageAtService: 44500, cost: 45, notes: 'Synthetic 5W-30' },
    { id: 's2', vehicleId: 'v2', serviceType: 'Tire Rotation', date: '2025-09-20', mileageAtService: 27800, cost: 25, notes: '' },
  ];
  reminders = [
    { id: 'r1', vehicleId: 'v1', title: 'Next Oil Change', dueDate: '2026-03-15', dueMileage: 49500, completed: false },
    { id: 'r2', vehicleId: 'v2', title: 'Brake Inspection', dueDate: '2025-06-01', dueMileage: 30000, completed: false },
  ];
  nextId = 100;
}

export function getVehicles() { return vehicles; }
export function addVehicle(data: Omit<Vehicle, 'id'>): Vehicle {
  const v: Vehicle = { id: `v${nextId++}`, ...data };
  vehicles = [...vehicles, v];
  return v;
}
export function updateMileage(id: string, mileage: number) {
  vehicles = vehicles.map(v => v.id === id ? { ...v, mileage } : v);
}
export function deleteVehicle(id: string) {
  serviceRecords = serviceRecords.filter(s => s.vehicleId !== id);
  reminders = reminders.filter(r => r.vehicleId !== id);
  vehicles = vehicles.filter(v => v.id !== id);
}

export function getServiceRecords() { return serviceRecords; }
export function addServiceRecord(data: Omit<ServiceRecord, 'id'>): ServiceRecord {
  const s: ServiceRecord = { id: `s${nextId++}`, ...data };
  serviceRecords = [...serviceRecords, s];
  return s;
}
export function deleteServiceRecord(id: string) { serviceRecords = serviceRecords.filter(s => s.id !== id); }

export function getReminders() { return reminders; }
export function addReminder(data: Omit<Reminder, 'id'>): Reminder {
  const r: Reminder = { id: `r${nextId++}`, ...data };
  reminders = [...reminders, r];
  return r;
}
export function toggleReminder(id: string) {
  reminders = reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r);
}
export function deleteReminder(id: string) { reminders = reminders.filter(r => r.id !== id); }
