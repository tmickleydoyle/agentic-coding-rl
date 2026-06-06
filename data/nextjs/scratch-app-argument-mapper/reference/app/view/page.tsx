import React, { useState, useEffect } from "react";
import { Argument } from "../../lib/types";

export function ViewPage() {
  const [args, setArgs] = useState<Argument[]>([]);

  useEffect(() => {
    fetch("/api/items").then((r) => r.json()).then((d) => setArgs(d.arguments ?? []));
  }, []);

  const claims = args.filter((a) => a.type === "claim");

  const renderTree = (parent: Argument): React.ReactNode => {
    const children = args.filter((a) => a.parentId === parent.id);
    return (
      <li key={parent.id} data-testid={`arg-item-${parent.id}`}>
        <span data-testid={`arg-text-${parent.id}`}>{parent.text}</span>
        <span data-testid={`arg-type-${parent.id}`}>[{parent.type}]</span>
        {children.length > 0 && <ul>{children.map(renderTree)}</ul>}
      </li>
    );
  };

  return (
    <div data-testid="view-page">
      <h1>Argument Map</h1>
      <ul data-testid="arguments-tree">
        {claims.map(renderTree)}
      </ul>
      {args.length === 0 && <p data-testid="empty-map">No arguments yet.</p>}
    </div>
  );
}
