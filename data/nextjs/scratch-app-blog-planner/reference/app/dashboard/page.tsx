"use client";
import React, { useEffect, useState } from "react";
import { Post } from "../../lib/types";

export function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts").then((r) => r.json()).then((d) => setPosts(d.posts ?? []));
  }, []);

  const counts = { idea: 0, draft: 0, scheduled: 0, published: 0 };
  posts.forEach((p) => { counts[p.status] = (counts[p.status] || 0) + 1; });

  const upcoming = posts
    .filter((p) => p.status === "scheduled" && p.scheduledDate)
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
    .slice(0, 5);

  return (
    <div data-testid="dashboard-page">
      <h1>Blog Planner Dashboard</h1>
      <div data-testid="count-ideas">{counts.idea}</div>
      <div data-testid="count-drafts">{counts.draft}</div>
      <div data-testid="count-scheduled">{counts.scheduled}</div>
      <div data-testid="count-published">{counts.published}</div>
      <ul data-testid="upcoming-posts">
        {upcoming.map((p) => (
          <li key={p.id} data-testid={`upcoming-${p.id}`}>{p.title} — {p.scheduledDate}</li>
        ))}
      </ul>
    </div>
  );
}
