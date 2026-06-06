import type { Post, Member, CommunityEvent, PostCategory } from "./types";

const seedPosts: Post[] = [
  { id: "p1", title: "Park cleanup this Saturday", author: "Alice", category: "News", content: "Meet at 9am near the fountain.", timestamp: "2024-06-01" },
  { id: "p2", title: "Lost cat on Elm St", author: "Bob", category: "News", content: "Orange tabby, answers to Mochi.", timestamp: "2024-06-02" },
  { id: "p3", title: "Anyone know a good plumber?", author: "Carol", category: "Question", content: "Need help with leaky pipe.", timestamp: "2024-06-03" },
];

const seedMembers: Member[] = [
  { id: "m1", name: "Alice", role: "Admin", joined: "2023-01-15" },
  { id: "m2", name: "Bob", role: "Member", joined: "2023-03-20" },
  { id: "m3", name: "Carol", role: "Member", joined: "2023-05-10" },
];

const seedEvents: CommunityEvent[] = [
  { id: "e1", title: "Block Party", date: "2024-07-04", location: "Main St", attendees: 12 },
  { id: "e2", title: "Town Hall Meeting", date: "2024-07-15", location: "Community Center", attendees: 5 },
];

let posts: Post[] = seedPosts.map((p) => ({ ...p }));
let members: Member[] = seedMembers.map((m) => ({ ...m }));
let events: CommunityEvent[] = seedEvents.map((e) => ({ ...e }));
let nextPId = 4;

export function getPosts(): Post[] { return posts; }
export function getMembers(): Member[] { return members; }
export function getEvents(): CommunityEvent[] { return events; }

export function addPost(title: string, author: string, category: PostCategory, content: string): Post {
  const p: Post = { id: `p${nextPId++}`, title, author, category, content, timestamp: new Date().toISOString().slice(0, 10) };
  posts = [...posts, p];
  return p;
}

export function promoteToAdmin(id: string): void {
  members = members.map((m) => m.id === id ? { ...m, role: "Admin" } : m);
}

export function rsvpEvent(id: string): void {
  events = events.map((e) => e.id === id ? { ...e, attendees: e.attendees + 1 } : e);
}

export function __reset(): void {
  posts = seedPosts.map((p) => ({ ...p }));
  members = seedMembers.map((m) => ({ ...m }));
  events = seedEvents.map((e) => ({ ...e }));
  nextPId = 4;
}
