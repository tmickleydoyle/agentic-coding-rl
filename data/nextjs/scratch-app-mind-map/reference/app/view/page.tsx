import React, { useState, useEffect } from "react";
import { MindMapNode } from "../../lib/types";

function NodeTree({ nodes, parentId }: { nodes: MindMapNode[]; parentId: string | null }) {
  const children = nodes.filter((n) => n.parentId === parentId);
  if (children.length === 0) return null;
  return (
    <ul data-testid={`children-of-${parentId ?? "root"}`}>
      {children.map((n) => (
        <li key={n.id} data-testid={`node-item-${n.id}`}>
          <span data-testid={`node-label-${n.id}`} style={{ color: n.color }}>{n.label}</span>
          <NodeTree nodes={nodes} parentId={n.id} />
        </li>
      ))}
    </ul>
  );
}

export function ViewPage() {
  const [nodes, setNodes] = useState<MindMapNode[]>([]);

  useEffect(() => {
    fetch("/api/items").then((r) => r.json()).then((d) => setNodes(d.nodes ?? []));
  }, []);

  return (
    <div data-testid="view-page">
      <h1>Mind Map</h1>
      <div data-testid="mind-map-tree">
        <NodeTree nodes={nodes} parentId={null} />
      </div>
      {nodes.length === 0 && <p data-testid="empty-map">No nodes yet.</p>}
    </div>
  );
}
