export type CampaignStatus = "Active" | "Closed";

export interface Campaign {
  id: string;
  name: string;
  goal: number;
  raised: number;
  status: CampaignStatus;
  endDate: string;
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  totalDonated: number;
  campaignCount: number;
}
