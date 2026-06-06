import { MindMapNode } from "./types";

export function getNodes(): MindMapNode[] { return []; }
export function getNodeById(_id: string): MindMapNode | undefined { return undefined; }
export function addNode(_data: Omit<MindMapNode, "id" | "createdAt">): MindMapNode {
  return { id: "", label: "", parentId: null, color: "blue", createdAt: "" };
}
export function updateNode(_id: string, _data: Partial<Omit<MindMapNode, "id" | "createdAt">>): MindMapNode | undefined { return undefined; }
export function deleteNode(_id: string): boolean { return false; }
export function getChildren(_parentId: string | null): MindMapNode[] { return []; }
export function getNodesByColor(_color: string): MindMapNode[] { return []; }
export function __reset(): void {}
