import { Policy, Claim, Document, Contact, ClaimStatus } from "./types";

export function __reset(): void {}
export function getPolicies(): Policy[] { return []; }
export function addPolicy(_data: Omit<Policy, "id">): Policy { return {} as Policy; }
export function removePolicy(_id: string): boolean { return false; }
export function getClaims(): Claim[] { return []; }
export function addClaim(_data: Omit<Claim, "id">): Claim { return {} as Claim; }
export function updateClaimStatus(_id: string, _status: ClaimStatus): Claim | null { return null; }
export function getDocuments(): Document[] { return []; }
export function addDocument(_data: Omit<Document, "id">): Document { return {} as Document; }
export function getContacts(): Contact[] { return []; }
export function addContact(_data: Omit<Contact, "id">): Contact { return {} as Contact; }
export function removeContact(_id: string): boolean { return false; }
