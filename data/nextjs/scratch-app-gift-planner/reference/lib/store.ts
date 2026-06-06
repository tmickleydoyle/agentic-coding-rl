import { Recipient, Occasion, Gift, GiftStatus } from "./types";

let recipients: Recipient[] = [
  { id: "rc1", name: "Mom", relation: "mother" },
  { id: "rc2", name: "Best Friend Jake", relation: "friend" },
];

let occasions: Occasion[] = [
  { id: "oc1", name: "Mom's Birthday", date: "2024-08-15", type: "birthday", recipientId: "rc1" },
  { id: "oc2", name: "Christmas", date: "2024-12-25", type: "holiday", recipientId: "" },
];

let gifts: Gift[] = [
  { id: "gi1", title: "Cookbook", description: "Italian recipes", price: 35, occasionId: "oc1", recipientId: "rc1", status: "purchased" },
  { id: "gi2", title: "Scarf", description: "Wool scarf", price: 50, occasionId: "oc2", recipientId: "rc1", status: "idea" },
  { id: "gi3", title: "Video Game", description: "New release", price: 60, occasionId: "oc2", recipientId: "rc2", status: "idea" },
];

let nextRecipientId = 3;
let nextOccasionId = 3;
let nextGiftId = 4;

export function __reset() {
  recipients = [
    { id: "rc1", name: "Mom", relation: "mother" },
    { id: "rc2", name: "Best Friend Jake", relation: "friend" },
  ];
  occasions = [
    { id: "oc1", name: "Mom's Birthday", date: "2024-08-15", type: "birthday", recipientId: "rc1" },
    { id: "oc2", name: "Christmas", date: "2024-12-25", type: "holiday", recipientId: "" },
  ];
  gifts = [
    { id: "gi1", title: "Cookbook", description: "Italian recipes", price: 35, occasionId: "oc1", recipientId: "rc1", status: "purchased" },
    { id: "gi2", title: "Scarf", description: "Wool scarf", price: 50, occasionId: "oc2", recipientId: "rc1", status: "idea" },
    { id: "gi3", title: "Video Game", description: "New release", price: 60, occasionId: "oc2", recipientId: "rc2", status: "idea" },
  ];
  nextRecipientId = 3; nextOccasionId = 3; nextGiftId = 4;
}

export function getRecipients(): Recipient[] { return recipients; }
export function addRecipient(data: Omit<Recipient, "id">): Recipient {
  const r: Recipient = { id: `rc${nextRecipientId++}`, ...data };
  recipients.push(r);
  return r;
}
export function removeRecipient(id: string): boolean {
  const idx = recipients.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  recipients.splice(idx, 1);
  return true;
}

export function getOccasions(): Occasion[] { return occasions; }
export function addOccasion(data: Omit<Occasion, "id">): Occasion {
  const o: Occasion = { id: `oc${nextOccasionId++}`, ...data };
  occasions.push(o);
  return o;
}
export function removeOccasion(id: string): boolean {
  const idx = occasions.findIndex((o) => o.id === id);
  if (idx === -1) return false;
  occasions.splice(idx, 1);
  return true;
}

export function getGifts(): Gift[] { return gifts; }
export function addGift(data: Omit<Gift, "id">): Gift {
  const g: Gift = { id: `gi${nextGiftId++}`, ...data };
  gifts.push(g);
  return g;
}
export function removeGift(id: string): boolean {
  const idx = gifts.findIndex((g) => g.id === id);
  if (idx === -1) return false;
  gifts.splice(idx, 1);
  return true;
}
export function updateGiftStatus(id: string, status: GiftStatus): Gift | null {
  const g = gifts.find((g) => g.id === id);
  if (!g) return null;
  g.status = status;
  return g;
}
export function getGiftsByOccasion(occasionId: string): Gift[] {
  return gifts.filter((g) => g.occasionId === occasionId);
}
