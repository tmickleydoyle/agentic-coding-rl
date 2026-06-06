import type { ApprovalRequest, RequestType, RequestStatus } from "./types";

export function getRequests(): ApprovalRequest[] {
  return [];
}

export function getRequest(_id: string): ApprovalRequest | undefined {
  return undefined;
}

export function addRequest(_data: {
  title: string; submitter: string; type: RequestType; amount: number;
}): ApprovalRequest {
  throw new Error("Not implemented");
}

export function updateRequest(_id: string, _status: RequestStatus, _comment: string): ApprovalRequest | undefined {
  return undefined;
}

export function __reset(): void {}
