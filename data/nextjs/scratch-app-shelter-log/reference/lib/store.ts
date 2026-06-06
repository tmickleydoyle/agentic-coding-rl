import type { Resident, Bed, ServiceLog, ServiceType } from "./types";

const seedResidents: Resident[] = [
  { id: "r1", name: "James Doe", age: 34, checkIn: "2024-05-10", status: "Staying" },
  { id: "r2", name: "Maria Santos", age: 28, checkIn: "2024-05-15", status: "Staying" },
  { id: "r3", name: "Tom Webb", age: 45, checkIn: "2024-04-01", status: "Departed" },
];

const seedBeds: Bed[] = [
  { id: "b1", bedNumber: "A-01", wing: "A", occupied: true, residentId: "r1" },
  { id: "b2", bedNumber: "A-02", wing: "A", occupied: true, residentId: "r2" },
  { id: "b3", bedNumber: "B-01", wing: "B", occupied: false, residentId: null },
  { id: "b4", bedNumber: "B-02", wing: "B", occupied: false, residentId: null },
];

const seedServices: ServiceLog[] = [
  { id: "s1", residentId: "r1", service: "Meal", date: "2024-06-01", notes: "Dinner" },
  { id: "s2", residentId: "r2", service: "Counseling", date: "2024-06-02", notes: "Weekly session" },
];

let residents: Resident[] = seedResidents.map((r) => ({ ...r }));
let beds: Bed[] = seedBeds.map((b) => ({ ...b }));
let services: ServiceLog[] = seedServices.map((s) => ({ ...s }));
let nextRId = 4;
let nextSId = 3;

export function getResidents(): Resident[] { return residents; }
export function getBeds(): Bed[] { return beds; }
export function getServices(): ServiceLog[] { return services; }

export function addResident(name: string, age: number): Resident {
  const r: Resident = { id: `r${nextRId++}`, name, age, checkIn: new Date().toISOString().slice(0, 10), status: "Staying" };
  residents = [...residents, r];
  return r;
}

export function markDeparted(id: string): void {
  residents = residents.map((r) => r.id === id ? { ...r, status: "Departed" } : r);
  beds = beds.map((b) => b.residentId === id ? { ...b, occupied: false, residentId: null } : b);
}

export function assignBed(bedId: string, residentId: string): void {
  beds = beds.map((b) => b.id === bedId ? { ...b, occupied: true, residentId } : b);
}

export function addService(residentId: string, service: ServiceType, date: string, notes: string): ServiceLog {
  const s: ServiceLog = { id: `s${nextSId++}`, residentId, service, date, notes };
  services = [...services, s];
  return s;
}

export function __reset(): void {
  residents = seedResidents.map((r) => ({ ...r }));
  beds = seedBeds.map((b) => ({ ...b }));
  services = seedServices.map((s) => ({ ...s }));
  nextRId = 4; nextSId = 3;
}
