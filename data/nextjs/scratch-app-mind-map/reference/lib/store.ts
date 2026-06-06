import { MindMapNode } from "./types";

let nodes: MindMapNode[] = [];
let nextId = 1;

export function getNodes(): MindMapNode[] { return nodes; }

export function getNodeById(id: string): MindMapNode | undefined {
  return nodes.find((n) => n.id === id);
}

export function addNode(data: Omit<MindMapNode, "id" | "createdAt">): MindMapNode {
  const node: MindMapNode = { ...data, id: String(nextId++), createdAt: new Date().toISOString() };
  nodes.push(node);
  return node;
}

export function updateNode(id: string, data: Partial<Omit<MindMapNode, "id" | "createdAt">>): MindMapNode | undefined {
  const idx = nodes.findIndex((n) => n.id === id);
  if (idx === -1) return undefined;
  nodes[idx] = { ...nodes[idx], ...data };
  return nodes[idx];
}

export function deleteNode(id: string): boolean {
  const idx = nodes.findIndex((n) => n.id === id);
  if (idx === -1) return false;
  // also remove children
  const toRemove = new Set<string>([id]);
  let changed = true;
  while (changed) {
    changed = false;
    nodes.forEach((n) => {
      if (n.parentId && toRemove.has(n.parentId) && !toRemove.has(n.id)) {
        toRemove.add(n.id);
        changed = true;
      }
    });
  }
  nodes = nodes.filter((n) => !toRemove.has(n.id));
  return true;
}

export function getChildren(parentId: string | null): MindMapNode[] {
  return nodes.filter((n) => n.parentId === parentId);
}

export function getNodesByColor(color: string): MindMapNode[] {
  return nodes.filter((n) => n.color === color);
}

export function __reset(): void {
  nodes = [];
  nextId = 1;
}
