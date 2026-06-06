import type { Vehicle, ServiceRecord, Reminder } from './types';
let vehicles: Vehicle[] = []; let serviceRecords: ServiceRecord[] = []; let reminders: Reminder[] = [];
export function __reset() { vehicles = []; serviceRecords = []; reminders = []; }
export function getVehicles() { return vehicles; }
export function addVehicle(_d: Omit<Vehicle,'id'>): Vehicle { return {} as Vehicle; }
export function updateMileage(_id: string, _m: number) {}
export function deleteVehicle(_id: string) {}
export function getServiceRecords() { return serviceRecords; }
export function addServiceRecord(_d: Omit<ServiceRecord,'id'>): ServiceRecord { return {} as ServiceRecord; }
export function deleteServiceRecord(_id: string) {}
export function getReminders() { return reminders; }
export function addReminder(_d: Omit<Reminder,'id'>): Reminder { return {} as Reminder; }
export function toggleReminder(_id: string) {}
export function deleteReminder(_id: string) {}
