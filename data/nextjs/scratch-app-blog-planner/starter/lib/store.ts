import { Post, PostStatus } from "./types";

export function __reset() {}
export function getPosts(_status?: PostStatus): Post[] { return []; }
export function addPost(_data: Omit<Post, "id" | "createdAt">): Post {
  return { id: "", title: "", status: "draft", category: "", scheduledDate: "", notes: "", createdAt: 0 };
}
export function updatePost(_id: string, _data: Partial<Omit<Post, "id">>): Post | null { return null; }
export function deletePost(_id: string): { error?: string } { return {}; }
export function promoteIdea(_id: string): Post | { error: string } { return { error: "not implemented" }; }
