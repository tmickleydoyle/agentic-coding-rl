"use client";
import React, { useEffect, useState } from "react";
import { ContentItem } from "../../lib/types";

export function DraftsPage() {
  const [drafts, setDrafts] = useState<ContentItem[]>([]);

  const load = () => {
    fetch("/api/content").then((r) => r.json()).then((d) => {
      const all: ContentItem[] = d.items ?? [];
      setDrafts(all.filter((i) => i.status === "draft" || i.status === "review"));
    });
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  };

  return (
    <div data-testid="drafts-page">
      <h1>Drafts</h1>
      {drafts.length === 0 ? (
        <div data-testid="no-drafts">No drafts</div>
      ) : (
        <ul data-testid="drafts-list">
          {drafts.map((item) => (
            <li key={item.id} data-testid={`draft-${item.id}`}>
              <span data-testid={`draft-title-${item.id}`}>{item.title}</span>
              <span data-testid={`draft-status-${item.id}`}>{item.status}</span>
              <select
                data-testid={`draft-status-select-${item.id}`}
                value={item.status}
                onChange={(e) => updateStatus(item.id, e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="approved">Approved</option>
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
