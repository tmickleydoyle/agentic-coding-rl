"use client";
import React, { useEffect, useState } from "react";
import { Post, PostStatus } from "../../lib/types";

export function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<"all" | PostStatus>("all");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/posts").then((r) => r.json()).then((d) => setPosts(d.posts ?? []));
  };
  useEffect(() => { load(); }, []);

  const addPost = async () => {
    setError("");
    if (!title.trim()) { setError("Title required"); return; }
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), status: "draft", category, scheduledDate: "", notes: "" }),
    });
    setTitle(""); setCategory("");
    load();
  };

  const deletePost = async (id: string) => {
    setError("");
    const res = await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    load();
  };

  const visible = filter === "all" ? posts : posts.filter((p) => p.status === filter);

  return (
    <div data-testid="posts-page">
      <h1>Posts</h1>
      {error && <div data-testid="posts-error">{error}</div>}
      <div data-testid="add-post-form">
        <input data-testid="post-title" value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        <input data-testid="post-category" value={category} placeholder="Category" onChange={(e) => setCategory(e.target.value)} />
        <button data-testid="add-post-btn" onClick={addPost}>Add Post</button>
      </div>
      <select data-testid="status-filter" value={filter} onChange={(e) => setFilter(e.target.value as "all" | PostStatus)}>
        <option value="all">All</option>
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
        <option value="published">Published</option>
        <option value="idea">Idea</option>
      </select>
      <ul data-testid="posts-list">
        {visible.map((p) => (
          <li key={p.id} data-testid={`post-${p.id}`}>
            <span data-testid={`post-title-${p.id}`}>{p.title}</span>
            <span data-testid={`post-status-${p.id}`}>{p.status}</span>
            <button data-testid={`delete-post-${p.id}`} onClick={() => deletePost(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
