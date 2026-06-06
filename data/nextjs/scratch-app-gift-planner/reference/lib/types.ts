export type OccasionType = "birthday" | "holiday" | "anniversary" | "other";
export type GiftStatus = "idea" | "purchased" | "given";

export interface Recipient {
  id: string;
  name: string;
  relation: string;
}

export interface Occasion {
  id: string;
  name: string;
  date: string;
  type: OccasionType;
  recipientId: string;
}

export interface Gift {
  id: string;
  title: string;
  description: string;
  price: number;
  occasionId: string;
  recipientId: string;
  status: GiftStatus;
}
