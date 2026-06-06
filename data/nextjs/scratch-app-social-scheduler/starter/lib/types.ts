export type Platform = "twitter" | "instagram" | "linkedin" | "facebook";
export type PostStatus = "draft" | "scheduled" | "posted" | "cancelled";

export interface SocialAccount {
  id: string;
  platform: Platform;
  handle: string;
  connected: boolean;
}

export interface SocialPost {
  id: string;
  body: string;
  accountIds: string[];
  status: PostStatus;
  scheduledAt: string;
  createdAt: number;
}

export type Route = "feed" | "compose" | "queue" | "accounts";
