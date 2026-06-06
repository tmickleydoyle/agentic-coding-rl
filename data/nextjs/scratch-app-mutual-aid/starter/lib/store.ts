import type { AidRequest, AidOffer, AidMatch, AidCategory } from "./types";
export function getRequests(): AidRequest[] { return []; }
export function getOffers(): AidOffer[] { return []; }
export function getMatches(): AidMatch[] { return []; }
export function addRequest(_title: string, _category: AidCategory, _requester: string): AidRequest { return { id: "", title: "", category: "Other", requester: "", status: "Open", date: "" }; }
export function fulfillRequest(_id: string): void {}
export function addOffer(_title: string, _category: AidCategory, _offerer: string): AidOffer { return { id: "", title: "", category: "Other", offerer: "", available: true, date: "" }; }
export function toggleAvailable(_id: string): void {}
export function createMatch(_requestId: string, _offerId: string, _matchedBy: string): AidMatch { return { id: "", requestId: "", offerId: "", matchedBy: "", date: "" }; }
export function __reset(): void {}
