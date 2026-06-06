import { SocialAccount, SocialPost, PostStatus } from "./types";

const seedAccounts: SocialAccount[] = [
  { id: "a1", platform: "twitter", handle: "@devnews", connected: true },
  { id: "a2", platform: "instagram", handle: "@devlife", connected: true },
  { id: "a3", platform: "linkedin", handle: "@developer", connected: true },
];

const seedPosts: SocialPost[] = [
  { id: "sp1", body: "Excited to share our new release!", accountIds: ["a1", "a3"], status: "scheduled", scheduledAt: "2030-06-01T10:00", createdAt: 1000 },
  { id: "sp2", body: "Behind the scenes look at our office", accountIds: ["a2"], status: "posted", scheduledAt: "2030-05-20T14:00", createdAt: 2000 },
  { id: "sp3", body: "Join our upcoming webinar", accountIds: ["a1", "a2", "a3"], status: "scheduled", scheduledAt: "2030-06-15T09:00", createdAt: 3000 },
];

let accounts: SocialAccount[] = seedAccounts.map((a) => ({ ...a }));
let posts: SocialPost[] = seedPosts.map((p) => ({ ...p, accountIds: [...p.accountIds] }));

export function __reset() {
  accounts = seedAccounts.map((a) => ({ ...a }));
  posts = seedPosts.map((p) => ({ ...p, accountIds: [...p.accountIds] }));
}

export function getAccounts(): SocialAccount[] { return accounts.map((a) => ({ ...a })); }

export function addAccount(data: Omit<SocialAccount, "id">): SocialAccount {
  const acc: SocialAccount = { id: `a${Date.now()}`, ...data };
  accounts.push(acc);
  return { ...acc };
}

export function removeAccount(id: string): { error?: string } {
  const inUse = posts.some((p) => p.accountIds.includes(id));
  if (inUse) return { error: "Account is referenced by posts" };
  accounts = accounts.filter((a) => a.id !== id);
  return {};
}

export function getPosts(status?: PostStatus): SocialPost[] {
  const list = posts.map((p) => ({ ...p, accountIds: [...p.accountIds] }));
  if (status) return list.filter((p) => p.status === status);
  return list;
}

export function addPost(data: Omit<SocialPost, "id" | "createdAt">): SocialPost | { error: string } {
  if (!data.body.trim()) return { error: "Body required" };
  if (!data.accountIds || data.accountIds.length === 0) return { error: "At least one account required" };
  if (!data.scheduledAt) return { error: "scheduledAt required" };
  if (data.body.length > 280) return { error: "Body exceeds 280 characters" };
  const post: SocialPost = { id: `sp${Date.now()}`, createdAt: Date.now(), ...data, accountIds: [...data.accountIds] };
  posts.push(post);
  return { ...post, accountIds: [...post.accountIds] };
}

export function cancelPost(id: string): SocialPost | { error: string } {
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return { error: "Not found" };
  if (posts[idx].status !== "scheduled") return { error: "Only scheduled posts can be cancelled" };
  posts[idx] = { ...posts[idx], status: "cancelled" };
  return { ...posts[idx], accountIds: [...posts[idx].accountIds] };
}
