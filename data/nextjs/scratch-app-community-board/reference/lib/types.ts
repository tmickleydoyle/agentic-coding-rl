export type PostCategory = "News" | "Question" | "Offer";
export type MemberRole = "Admin" | "Member";

export interface Post {
  id: string;
  title: string;
  author: string;
  category: PostCategory;
  content: string;
  timestamp: string;
}

export interface Member {
  id: string;
  name: string;
  role: MemberRole;
  joined: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
}
