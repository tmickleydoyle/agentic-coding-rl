import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { WikiPage } from "../../lib/types";

export default function PagesPage() {
  const { pages, categories, setPages } = useApp();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  function handleAdd() {
    if (!title.trim()) { setError("Title required"); return; }
    if (!author.trim()) { setError("Author required"); return; }
    if (!category) { setError("Category required"); return; }
    if (pages.some((p) => p.title.toLowerCase() === title.trim().toLowerCase())) {
      setError("Title already exists"); return;
    }
    setError("");
    const tagArr = Array.from(new Set(tags.split(",").map((t) => t.trim()).filter(Boolean)));
    const newPage: WikiPage = {
      id: String(Date.now()),
      title: title.trim(),
      content,
      category,
      author: author.trim(),
      tags: tagArr,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setPages([...pages, newPage]);
    setTitle(""); setContent(""); setAuthor(""); setTags(""); setCategory("");
  }

  function handleDelete(id: string) {
    setPages(pages.filter((p) => p.id !== id));
    if (viewId === id) setViewId(null);
  }

  if (viewId) {
    const page = pages.find((p) => p.id === viewId);
    if (page) {
      return (
        <div data-testid="page-view">
          <button data-testid="back-btn" onClick={() => setViewId(null)}>Back</button>
          <h2 data-testid="page-view-title">{page.title}</h2>
          <div data-testid="page-view-content">{page.content}</div>
          <div data-testid="page-view-author">{page.author}</div>
          <div data-testid="page-view-category">{page.category}</div>
          <div data-testid="page-view-tags">{page.tags.join(", ")}</div>
        </div>
      );
    }
  }

  return (
    <div data-testid="pages-page">
      <h1>Wiki Pages</h1>
      {error && <div data-testid="page-error">{error}</div>}
      <div data-testid="add-page-form">
        <input data-testid="page-title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea data-testid="page-content-input" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
        <select data-testid="page-category-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <input data-testid="page-author-input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
        <input data-testid="page-tags-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma-separated)" />
        <button data-testid="add-page-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul data-testid="page-list">
        {pages.map((p) => (
          <li key={p.id} data-testid={`page-item-${p.id}`}>
            <button data-testid={`view-page-${p.id}`} onClick={() => setViewId(p.id)}>{p.title}</button>
            <span data-testid={`page-category-${p.id}`}>{p.category}</span>
            <span data-testid={`page-author-${p.id}`}>{p.author}</span>
            <button data-testid={`delete-page-${p.id}`} onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
