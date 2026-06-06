"use client";
import React, { useEffect, useState } from "react";
import { Post } from "../../lib/types";

export function SchedulePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts").then((r) => r.json()).then((d) => {
      const all: Post[] = d.posts ?? [];
      const scheduled = all
        .filter((p) => p.status === "scheduled" || p.status === "published")
        .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
      setPosts(scheduled);
    });
  }, []);

  return (
    <div data-testid="schedule-page">
      <h1>Schedule</h1>
      {posts.length === 0 ? (
        <div data-testid="no-schedule">Nothing scheduled</div>
      ) : (
        <ul data-testid="schedule-list">
          {posts.map((p) => (
            <li key={p.id} data-testid={`sched-${p.id}`}>
              <span data-testid={`sched-title-${p.id}`}>{p.title}</span>
              <span data-testid={`sched-date-${p.id}`}>{p.scheduledDate}</span>
              <span data-testid={`sched-status-${p.id}`}>{p.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
