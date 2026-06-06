"use client";
import { useState } from "react";

type Priority = "Low" | "Medium" | "High";

interface WishItem {
  id: number;
  title: string;
  author: string;
  genre: string;
  priority: Priority;
  notes: string;
}

const SEED_ITEMS: WishItem[] = [
  { id: 1, title: "The Road", author: "Cormac McCarthy", genre: "Fiction", priority: "High", notes: "Recommended by a friend." },
  { id: 2, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", genre: "Psychology", priority: "Medium", notes: "Must read for decision making." },
  { id: 3, title: "The Name of the Wind", author: "Patrick Rothfuss", genre: "Fantasy", priority: "Low", notes: "Part of a trilogy." },
];

let nextId = 4;

const PRIORITY_ORDER: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };

export default function App() {
  const [items, setItems] = useState<WishItem[]>(SEED_ITEMS);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [notes, setNotes] = useState("");
  const [filterPriority, setFilterPriority] = useState<"All" | Priority>("All");

  function handleAdd() {
    if (!title.trim() || !author.trim() || !genre.trim()) return;
    setItems((prev) => [
      ...prev,
      { id: nextId++, title: title.trim(), author: author.trim(), genre: genre.trim(), priority, notes: notes.trim() },
    ]);
    setTitle("");
    setAuthor("");
    setGenre("");
    setPriority("Medium");
    setNotes("");
  }

  function handleDelete(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function handleSort() {
    setItems((prev) => [...prev].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]));
  }

  const filtered = filterPriority === "All" ? items : items.filter((i) => i.priority === filterPriority);

  return (
    <main>
      <h1>Library Wishlist</h1>

      <section data-testid="add-form">
        <input
          data-testid="input-title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Title"
        />
        <input
          data-testid="input-author"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          aria-label="Author"
        />
        <input
          data-testid="input-genre"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          aria-label="Genre"
        />
        <select
          data-testid="select-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          aria-label="Priority"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <textarea
          data-testid="input-notes"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          aria-label="Notes"
        />
        <button data-testid="btn-add" onClick={handleAdd}>Add to Wishlist</button>
      </section>

      <section data-testid="controls">
        <select
          data-testid="filter-priority"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as "All" | Priority)}
          aria-label="Filter by priority"
        >
          <option value="All">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button data-testid="btn-sort" onClick={handleSort}>Sort by Priority</button>
      </section>

      <ul data-testid="wishlist">
        {filtered.map((item) => (
          <li key={item.id} data-testid={`wish-card-${item.id}`}>
            <span data-testid={`wish-title-${item.id}`}>{item.title}</span>
            <span data-testid={`wish-author-${item.id}`}>{item.author}</span>
            <span data-testid={`wish-genre-${item.id}`}>{item.genre}</span>
            <span data-testid={`wish-priority-${item.id}`}>Priority: {item.priority}</span>
            {item.notes && <span data-testid={`wish-notes-${item.id}`}>{item.notes}</span>}
            <button data-testid={`btn-delete-${item.id}`} onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
