export type VisaStatus = "applied" | "approved" | "expired";

export interface Visa {
  id: string;
  country: string;
  visaType: string;
  appliedDate: string;
  expiryDate: string;
  status: VisaStatus;
  passportNumber: string;
  notes: string;
}
