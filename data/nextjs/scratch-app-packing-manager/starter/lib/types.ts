export interface PackingItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
  quantity: number;
}

export interface PackingList {
  id: string;
  tripName: string;
  destination: string;
  departureDate: string;
  items: PackingItem[];
}
