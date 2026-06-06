import type { ApprovalRequest, RequestType, RequestStatus } from "./types";

const seed: ApprovalRequest[] = [
  { id: "1", title: "Budget Increase Q2", submitter: "alice@example.com", type: "Budget", amount: 15000, status: "Pending", comment: "", submittedAt: "2024-01-10" },
  { id: "2", title: "New Software License", submitter: "bob@example.com", type: "Software", amount: 2500, status: "Approved", comment: "Approved for team use", submittedAt: "2024-01-12" },
  { id: "3", title: "Conference Travel", submitter: "carol@example.com", type: "Travel", amount: 3000, status: "Rejected", comment: "Over budget", submittedAt: "2024-01-14" },
];

let requests: ApprovalRequest[] = seed.map((r) => ({ ...r }));
let nextId = 4;

export function getRequests(): ApprovalRequest[] {
  return requests;
}

export function getRequest(id: string): ApprovalRequest | undefined {
  return requests.find((r) => r.id === id);
}

export function addRequest(data: {
  title: string; submitter: string; type: RequestType; amount: number;
}): ApprovalRequest {
  const req: ApprovalRequest = {
    id: String(nextId++),
    title: data.title,
    submitter: data.submitter,
    type: data.type,
    amount: data.amount,
    status: "Pending",
    comment: "",
    submittedAt: new Date().toISOString().slice(0, 10),
  };
  requests.push(req);
  return req;
}

export function updateRequest(id: string, status: RequestStatus, comment: string): ApprovalRequest | undefined {
  const req = requests.find((r) => r.id === id);
  if (!req) return undefined;
  req.status = status;
  req.comment = comment;
  return req;
}

export function __reset(): void {
  requests = seed.map((r) => ({ ...r }));
  nextId = 4;
}
