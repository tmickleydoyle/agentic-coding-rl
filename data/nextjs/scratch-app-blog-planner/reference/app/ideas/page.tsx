"use client";
import React, { useEffect, useState } from "react";
import { Post } from "../../lib/types";

export function IdeasPage() {
  const [ideas, setIdeas] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  const load = () => {
    fetch("/api/posts?status=idea").then((r) => r.json()).then((d) => setIdeas(d.posts ?? []));
  };
  useEffect(() => { load(); }, []);

  const addIdea = async () => {
    if (!title.trim()) return;
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), status: "idea", category: "", scheduledDate: "", notes }),
    });
    setTitle(""); setNotes("");
    load();
  };

  const promote = async (id: string) => {
    await fetch("/api/posts/promote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <div data-testid="ideas-page">
      <h1>Ideas</h1>
      <div data-testid="add-idea-form">
        <input data-testid="idea-title" value={title} placeholder="Idea title" onChange={(e) => setTitle(e.target.value)} />
        <input data-testid="idea-notes" value={notes} placeholder="Notes" onChange={(e) => setNotes(e.target.value)} />
        <button data-testid="add-idea-btn" onClick={addIdea}>Add Idea</button>
      </div>
      {ideas.length === 0 ? (
        <div data-testid="no-ideas">No ideas yet</div>
      ) : (
        <ul data-testid="ideas-list">
          {ideas.map((i) => (
            <li key={i.id} data-testid={`idea-${i.id}`}>
              <span data-testid={`idea-title-${i.id}`}>{i.title}</span>
              <button data-testid={`promote-idea-${i.id}`} onClick={() => promote(i.id)}>Promote to Draft</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
