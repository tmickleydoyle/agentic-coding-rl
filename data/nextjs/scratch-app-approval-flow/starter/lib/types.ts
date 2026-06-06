export type RequestType = "Budget" | "Software" | "Travel" | "Equipment" | "Other";
export type RequestStatus = "Pending" | "Approved" | "Rejected";

export interface ApprovalRequest {
  id: string;
  title: string;
  submitter: string;
  type: RequestType;
  amount: number;
  status: RequestStatus;
  comment: string;
  submittedAt: string;
}

export type Route =
  | { name: "dashboard" }
  | { name: "list" }
  | { name: "add" }
  | { name: "detail"; id: string };
