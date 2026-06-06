import { SocialAccount, SocialPost, PostStatus } from "./types";

export function __reset() {}
export function getAccounts(): SocialAccount[] { return []; }
export function addAccount(_data: Omit<SocialAccount, "id">): SocialAccount {
  return { id: "", platform: "twitter", handle: "", connected: false };
}
export function removeAccount(_id: string): { error?: string } { return {}; }
export function getPosts(_status?: PostStatus): SocialPost[] { return []; }
export function addPost(_data: Omit<SocialPost, "id" | "createdAt">): SocialPost | { error: string } {
  return { error: "not implemented" };
}
export function cancelPost(_id: string): SocialPost | { error: string } { return { error: "not implemented" }; }
