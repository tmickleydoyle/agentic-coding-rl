"use client";
import React, { useEffect, useState } from "react";
import { SocialPost } from "../../lib/types";

export function FeedPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);

  useEffect(() => {
    fetch("/api/posts").then((r) => r.json()).then((d) => {
      const all: SocialPost[] = d.posts ?? [];
      setPosts(all.sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt)));
    });
  }, []);

  return (
    <div data-testid="feed-page">
      <h1>Feed</h1>
      <ul data-testid="feed-list">
        {posts.map((p) => (
          <li key={p.id} data-testid={`feed-post-${p.id}`}>
            <span data-testid={`feed-body-${p.id}`}>{p.body}</span>
            <span data-testid={`feed-status-${p.id}`}>{p.status}</span>
            <span data-testid={`feed-date-${p.id}`}>{p.scheduledAt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
