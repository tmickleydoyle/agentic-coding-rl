import { WikiPage, WikiCategory } from "./types";

export function getPages(): WikiPage[] { return []; }
export function addPage(_data: Omit<WikiPage, "id">): WikiPage | { error: string } { return { error: "Not implemented" }; }
export function updatePage(_id: string, _data: Partial<Omit<WikiPage, "id">>): WikiPage | null { return null; }
export function deletePage(_id: string): boolean { return false; }
export function getCategories(): WikiCategory[] { return []; }
export function addCategory(_name: string): WikiCategory { return { id: "", name: "" }; }
export function deleteCategory(_id: string): { success: boolean; error?: string } { return { success: false }; }
export function searchPages(_query: string): WikiPage[] { return []; }
export function __reset(): void {}
