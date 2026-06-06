import type { AidRequest, AidOffer, AidMatch, AidCategory } from "./types";

const seedRequests: AidRequest[] = [
  { id: "req1", title: "Need groceries delivered", category: "Food", requester: "Alice", status: "Open", date: "2024-06-01" },
  { id: "req2", title: "Ride to clinic", category: "Transport", requester: "Bob", status: "Open", date: "2024-06-02" },
  { id: "req3", title: "Babysitting Tuesday", category: "Childcare", requester: "Carol", status: "Fulfilled", date: "2024-06-03" },
];

const seedOffers: AidOffer[] = [
  { id: "off1", title: "Can deliver groceries", category: "Food", offerer: "Dave", available: true, date: "2024-06-01" },
  { id: "off2", title: "Happy to drive", category: "Transport", offerer: "Eve", available: true, date: "2024-06-02" },
  { id: "off3", title: "Available for babysitting", category: "Childcare", offerer: "Frank", available: false, date: "2024-06-03" },
];

const seedMatches: AidMatch[] = [
  { id: "m1", requestId: "req3", offerId: "off3", matchedBy: "Admin", date: "2024-06-04" },
];

let requests: AidRequest[] = seedRequests.map((r) => ({ ...r }));
let offers: AidOffer[] = seedOffers.map((o) => ({ ...o }));
let matches: AidMatch[] = seedMatches.map((m) => ({ ...m }));
let nextReqId = 4;
let nextOffId = 4;
let nextMId = 2;

export function getRequests(): AidRequest[] { return requests; }
export function getOffers(): AidOffer[] { return offers; }
export function getMatches(): AidMatch[] { return matches; }

export function addRequest(title: string, category: AidCategory, requester: string): AidRequest {
  const r: AidRequest = { id: `req${nextReqId++}`, title, category, requester, status: "Open", date: new Date().toISOString().slice(0, 10) };
  requests = [...requests, r];
  return r;
}

export function fulfillRequest(id: string): void {
  requests = requests.map((r) => r.id === id ? { ...r, status: "Fulfilled" } : r);
}

export function addOffer(title: string, category: AidCategory, offerer: string): AidOffer {
  const o: AidOffer = { id: `off${nextOffId++}`, title, category, offerer, available: true, date: new Date().toISOString().slice(0, 10) };
  offers = [...offers, o];
  return o;
}

export function toggleAvailable(id: string): void {
  offers = offers.map((o) => o.id === id ? { ...o, available: !o.available } : o);
}

export function createMatch(requestId: string, offerId: string, matchedBy: string): AidMatch {
  const m: AidMatch = { id: `m${nextMId++}`, requestId, offerId, matchedBy, date: new Date().toISOString().slice(0, 10) };
  matches = [...matches, m];
  return m;
}

export function __reset(): void {
  requests = seedRequests.map((r) => ({ ...r }));
  offers = seedOffers.map((o) => ({ ...o }));
  matches = seedMatches.map((m) => ({ ...m }));
  nextReqId = 4; nextOffId = 4; nextMId = 2;
}
