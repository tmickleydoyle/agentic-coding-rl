export type CampaignStatus = "draft" | "scheduled" | "sent";

export interface Campaign {
  id: string;
  subject: string;
  templateId: string;
  status: CampaignStatus;
  scheduledAt: string;
  sentCount: number;
  openCount: number;
  clickCount: number;
  createdAt: number;
}

export interface Subscriber {
  id: string;
  email: string;
  name: string;
  tags: string[];
  active: boolean;
  createdAt: number;
}

export interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: number;
}

export type Route = "campaigns" | "subscribers" | "templates" | "stats";
