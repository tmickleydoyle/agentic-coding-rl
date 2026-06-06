export type SignatureStatus = "Signed" | "Pending";

export interface Clause {
  id: string;
  title: string;
  body: string;
}

export interface Witness {
  id: string;
  name: string;
  status: SignatureStatus;
}
