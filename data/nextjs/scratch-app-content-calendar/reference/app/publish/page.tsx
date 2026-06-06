"use client";
import React, { useEffect, useState } from "react";
import { ContentItem } from "../../lib/types";

export function PublishPage() {
  const [queue, setQueue] = useState<ContentItem[]>([]);
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/content").then((r) => r.json()).then((d) => {
      const all: ContentItem[] = d.items ?? [];
      setQueue(all.filter((i) => i.status === "approved"));
    });
  };
  useEffect(() => { load(); }, []);

  const publish = async (id: string) => {
    setError("");
    const res = await fetch("/api/content/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    load();
  };

  return (
    <div data-testid="publish-page">
      <h1>Publish Queue</h1>
      {error && <div data-testid="publish-error">{error}</div>}
      {queue.length === 0 ? (
        <div data-testid="no-publish">Nothing to publish</div>
      ) : (
        <ul data-testid="publish-list">
          {queue.map((item) => (
            <li key={item.id} data-testid={`pub-item-${item.id}`}>
              <span data-testid={`pub-title-${item.id}`}>{item.title}</span>
              <button data-testid={`publish-btn-${item.id}`} onClick={() => publish(item.id)}>Publish</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
