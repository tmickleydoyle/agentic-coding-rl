export type AidCategory = "Food" | "Transport" | "Childcare" | "Other";
export type RequestStatus = "Open" | "Fulfilled";
export interface AidRequest { id: string; title: string; category: AidCategory; requester: string; status: RequestStatus; date: string; }
export interface AidOffer { id: string; title: string; category: AidCategory; offerer: string; available: boolean; date: string; }
export interface AidMatch { id: string; requestId: string; offerId: string; matchedBy: string; date: string; }
