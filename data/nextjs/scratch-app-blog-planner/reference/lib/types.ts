export type PostStatus = "idea" | "draft" | "scheduled" | "published";

export interface Post {
  id: string;
  title: string;
  status: PostStatus;
  category: string;
  scheduledDate: string;
  notes: string;
  createdAt: number;
}

export type Route = "dashboard" | "posts" | "ideas" | "schedule";
