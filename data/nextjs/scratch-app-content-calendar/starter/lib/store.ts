import { ContentItem, ContentStatus } from "./types";

export function __reset() {}
export function getItems(_status?: ContentStatus): ContentItem[] { return []; }
export function addItem(_data: Omit<ContentItem, "id" | "createdAt">): ContentItem | { error: string } { return { error: "not implemented" }; }
export function updateItem(_id: string, _data: Partial<Omit<ContentItem, "id">>): ContentItem | null { return null; }
export function publishItem(_id: string): ContentItem | { error: string } { return { error: "not implemented" }; }
export function deleteItem(_id: string): boolean { return false; }
