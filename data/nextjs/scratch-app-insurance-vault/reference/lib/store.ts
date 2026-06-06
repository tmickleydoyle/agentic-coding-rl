import { Policy, Claim, Document, Contact } from "./types";

let policies: Policy[] = [
  { id: "pol1", name: "Home Insurance", type: "home", provider: "SafeGuard", policyNumber: "SG-1001", premium: 150, startDate: "2024-01-01", endDate: "2025-01-01", active: true },
  { id: "pol2", name: "Auto Insurance", type: "auto", provider: "DriveRight", policyNumber: "DR-2002", premium: 120, startDate: "2024-03-01", endDate: "2025-03-01", active: true },
];
let claims: Claim[] = [
  { id: "cl1", policyId: "pol1", description: "Roof damage", amount: 5000, date: "2024-05-10", status: "open" },
];
let documents: Document[] = [
  { id: "doc1", policyId: "pol1", name: "Policy Certificate", url: "https://example.com/cert.pdf", type: "certificate" },
];
let contacts: Contact[] = [
  { id: "con1", name: "Jane Agent", company: "SafeGuard", phone: "555-1234", email: "jane@safeguard.com", role: "agent" },
];

let nextPolicyId = 3;
let nextClaimId = 2;
let nextDocId = 2;
let nextContactId = 2;

export function __reset() {
  policies = [
    { id: "pol1", name: "Home Insurance", type: "home", provider: "SafeGuard", policyNumber: "SG-1001", premium: 150, startDate: "2024-01-01", endDate: "2025-01-01", active: true },
    { id: "pol2", name: "Auto Insurance", type: "auto", provider: "DriveRight", policyNumber: "DR-2002", premium: 120, startDate: "2024-03-01", endDate: "2025-03-01", active: true },
  ];
  claims = [{ id: "cl1", policyId: "pol1", description: "Roof damage", amount: 5000, date: "2024-05-10", status: "open" }];
  documents = [{ id: "doc1", policyId: "pol1", name: "Policy Certificate", url: "https://example.com/cert.pdf", type: "certificate" }];
  contacts = [{ id: "con1", name: "Jane Agent", company: "SafeGuard", phone: "555-1234", email: "jane@safeguard.com", role: "agent" }];
  nextPolicyId = 3; nextClaimId = 2; nextDocId = 2; nextContactId = 2;
}

export function getPolicies(): Policy[] { return policies; }
export function addPolicy(data: Omit<Policy, "id">): Policy {
  const p: Policy = { id: `pol${nextPolicyId++}`, ...data };
  policies.push(p);
  return p;
}
export function removePolicy(id: string): boolean {
  const idx = policies.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  policies.splice(idx, 1);
  return true;
}

export function getClaims(): Claim[] { return claims; }
export function addClaim(data: Omit<Claim, "id">): Claim {
  const c: Claim = { id: `cl${nextClaimId++}`, ...data };
  claims.push(c);
  return c;
}
export function updateClaimStatus(id: string, status: ClaimStatus): Claim | null {
  const c = claims.find((c) => c.id === id);
  if (!c) return null;
  c.status = status;
  return c;
}

export function getDocuments(): Document[] { return documents; }
export function addDocument(data: Omit<Document, "id">): Document {
  const d: Document = { id: `doc${nextDocId++}`, ...data };
  documents.push(d);
  return d;
}

export function getContacts(): Contact[] { return contacts; }
export function addContact(data: Omit<Contact, "id">): Contact {
  const c: Contact = { id: `con${nextContactId++}`, ...data };
  contacts.push(c);
  return c;
}
export function removeContact(id: string): boolean {
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  contacts.splice(idx, 1);
  return true;
}
