import { Recipient, Occasion, Gift, GiftStatus } from "./types";

export function __reset(): void {}
export function getRecipients(): Recipient[] { return []; }
export function addRecipient(_data: Omit<Recipient, "id">): Recipient { return {} as Recipient; }
export function removeRecipient(_id: string): boolean { return false; }
export function getOccasions(): Occasion[] { return []; }
export function addOccasion(_data: Omit<Occasion, "id">): Occasion { return {} as Occasion; }
export function removeOccasion(_id: string): boolean { return false; }
export function getGifts(): Gift[] { return []; }
export function addGift(_data: Omit<Gift, "id">): Gift { return {} as Gift; }
export function removeGift(_id: string): boolean { return false; }
export function updateGiftStatus(_id: string, _status: GiftStatus): Gift | null { return null; }
export function getGiftsByOccasion(_occasionId: string): Gift[] { return []; }
