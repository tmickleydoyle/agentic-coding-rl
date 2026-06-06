export type FoodCategory = "Produce" | "Canned" | "Dry" | "Dairy";
export type DonationStatus = "Received" | "Pending";

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  quantity: number;
  unit: string;
  expiry: string;
}

export interface Donation {
  id: string;
  donor: string;
  items: string;
  date: string;
  status: DonationStatus;
}

export interface Client {
  id: string;
  name: string;
  householdSize: number;
  lastVisit: string;
}
