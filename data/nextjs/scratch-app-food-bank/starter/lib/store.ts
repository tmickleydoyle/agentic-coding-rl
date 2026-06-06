import type { FoodItem, Donation, Client, FoodCategory } from "./types";
export function getItems(): FoodItem[] { return []; }
export function getDonations(): Donation[] { return []; }
export function getClients(): Client[] { return []; }
export function addItem(_name: string, _category: FoodCategory, _quantity: number, _unit: string, _expiry: string): FoodItem { return { id: "", name: "", category: "Dry", quantity: 0, unit: "", expiry: "" }; }
export function adjustQuantity(_id: string, _delta: number): void {}
export function markReceived(_id: string): void {}
export function addClient(_name: string, _householdSize: number): Client { return { id: "", name: "", householdSize: 0, lastVisit: "" }; }
export function logVisit(_id: string): void {}
export function __reset(): void {}
