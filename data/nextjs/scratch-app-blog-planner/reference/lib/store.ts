import { Post, PostStatus } from "./types";

const seedPosts: Post[] = [
  { id: "p1", title: "How to Write Better Headlines", status: "draft", category: "SEO", scheduledDate: "", notes: "", createdAt: 1000 },
  { id: "p2", title: "10 Productivity Hacks", status: "scheduled", category: "Productivity", scheduledDate: "2030-01-15", notes: "", createdAt: 2000 },
  { id: "p3", title: "My Year in Books", status: "published", category: "Personal", scheduledDate: "2029-12-01", notes: "", createdAt: 3000 },
  { id: "i1", title: "AI in Content Marketing", status: "idea", category: "", scheduledDate: "", notes: "explore use cases", createdAt: 4000 },
  { id: "i2", title: "Remote Work Tips", status: "idea", category: "", scheduledDate: "", notes: "interviews needed", createdAt: 5000 },
];

let posts: Post[] = seedPosts.map((p) => ({ ...p }));

export function __reset() {
  posts = seedPosts.map((p) => ({ ...p }));
}

export function getPosts(status?: PostStatus): Post[] {
  const list = posts.map((p) => ({ ...p }));
  if (status) return list.filter((p) => p.status === status);
  return list;
}

export function addPost(data: Omit<Post, "id" | "createdAt">): Post {
  const post: Post = { id: `p${Date.now()}`, createdAt: Date.now(), ...data };
  posts.push(post);
  return { ...post };
}

export function updatePost(id: string, data: Partial<Omit<Post, "id">>): Post | null {
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  posts[idx] = { ...posts[idx], ...data };
  return { ...posts[idx] };
}

export function deletePost(id: string): { error?: string } {
  const post = posts.find((p) => p.id === id);
  if (!post) return { error: "Not found" };
  if (post.status === "published") return { error: "Cannot delete a published post" };
  posts = posts.filter((p) => p.id !== id);
  return {};
}

export function promoteIdea(id: string): Post | { error: string } {
  const idx = posts.findIndex((p) => p.id === id && p.status === "idea");
  if (idx === -1) return { error: "Idea not found" };
  posts[idx] = { ...posts[idx], status: "draft" };
  return { ...posts[idx] };
}
