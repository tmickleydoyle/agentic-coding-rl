import type { Resident, Bed, ServiceLog, ServiceType } from "./types";
export function getResidents(): Resident[] { return []; }
export function getBeds(): Bed[] { return []; }
export function getServices(): ServiceLog[] { return []; }
export function addResident(_name: string, _age: number): Resident { return { id: "", name: "", age: 0, checkIn: "", status: "Staying" }; }
export function markDeparted(_id: string): void {}
export function assignBed(_bedId: string, _residentId: string): void {}
export function addService(_residentId: string, _service: ServiceType, _date: string, _notes: string): ServiceLog { return { id: "", residentId: "", service: "Meal", date: "", notes: "" }; }
export function __reset(): void {}
