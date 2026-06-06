import type { Trip } from "./types";

const seed: Trip[] = [
  { id: "1", name: "Spring Break", destination: "Barcelona", startDate: "2024-04-01", endDate: "2024-04-10", status: "done", notes: "Great trip!" },
  { id: "2", name: "Summer Holiday", destination: "Greece", startDate: "2024-07-15", endDate: "2024-07-30", status: "planned", notes: "Book hotels." },
  { id: "3", name: "Work Trip", destination: "London", startDate: "2024-06-05", endDate: "2024-06-07", status: "active", notes: "Conference." },
];

let trips: Trip[] = seed.map((t) => ({ ...t }));
let nextId = 4;

export function getTrips(): Trip[] {
  return trips;
}

export function addTrip(data: Omit<Trip, "id">): Trip {
  const trip: Trip = { ...data, id: String(nextId++) };
  trips.push(trip);
  return trip;
}

export function __reset(): void {
  trips = seed.map((t) => ({ ...t }));
  nextId = 4;
}
