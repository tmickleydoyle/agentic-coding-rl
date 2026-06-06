import type { Trip } from "./types";

export function getTrips(): Trip[] {
  return [];
}

export function addTrip(_data: Omit<Trip, "id">): Trip {
  return { id: "", name: "", destination: "", startDate: "", endDate: "", status: "planned", notes: "" };
}

export function __reset(): void {}
