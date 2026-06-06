"use client";
import React, { useEffect, useState } from "react";
import { SocialPost } from "../../lib/types";

export function QueuePage() {
  const [queue, setQueue] = useState<SocialPost[]>([]);

  const load = () => {
    fetch("/api/posts?status=scheduled").then((r) => r.json()).then((d) => setQueue(d.posts ?? []));
  };
  useEffect(() => { load(); }, []);

  const cancel = async (id: string) => {
    await fetch("/api/posts/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <div data-testid="queue-page">
      <h1>Queue</h1>
      {queue.length === 0 ? (
        <div data-testid="empty-queue">Queue is empty</div>
      ) : (
        <ul data-testid="queue-list">
          {queue.map((p) => (
            <li key={p.id} data-testid={`queue-item-${p.id}`}>
              <span data-testid={`queue-body-${p.id}`}>{p.body}</span>
              <span data-testid={`queue-date-${p.id}`}>{p.scheduledAt}</span>
              <button data-testid={`cancel-btn-${p.id}`} onClick={() => cancel(p.id)}>Cancel</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
