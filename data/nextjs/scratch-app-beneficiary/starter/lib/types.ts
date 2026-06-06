export interface Profile {
  id: string;
  name: string;
  dob: string;
  email: string;
}

export interface Allocation {
  id: string;
  beneficiary: string;
  asset: string;
  percentage: number;
}
