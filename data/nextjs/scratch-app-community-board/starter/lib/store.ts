import type { Post, Member, CommunityEvent, PostCategory } from "./types";

export function getPosts(): Post[] { return []; }
export function getMembers(): Member[] { return []; }
export function getEvents(): CommunityEvent[] { return []; }
export function addPost(_title: string, _author: string, _category: PostCategory, _content: string): Post {
  return { id: "", title: "", author: "", category: "News", content: "", timestamp: "" };
}
export function promoteToAdmin(_id: string): void {}
export function rsvpEvent(_id: string): void {}
export function __reset(): void {}
