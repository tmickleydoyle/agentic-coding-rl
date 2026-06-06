export type AssetType = "Real Estate" | "Investment" | "Personal Property" | "Cash";
export type Relationship = "Spouse" | "Child" | "Sibling" | "Other";

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  value: number;
  beneficiary: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  relationship: Relationship;
}

export interface EstateState {
  assets: Asset[];
  beneficiaries: Beneficiary[];
  notes: string;
  route: string;
}
