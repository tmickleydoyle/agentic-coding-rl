export type Channel = "blog" | "twitter" | "linkedin" | "email";
export type ContentStatus = "draft" | "review" | "approved" | "published";

export interface ContentItem {
  id: string;
  title: string;
  body: string;
  channel: Channel;
  status: ContentStatus;
  scheduledDate: string;
  createdAt: number;
}

export type Route = "calendar" | "drafts" | "publish" | "analytics";
