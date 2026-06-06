import React, { useEffect } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import type { JournalEntry } from "../lib/types";

function HomePage() {
  const { entries, navigate } = useApp();
  const recent = [...entries].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);
  return (
    <div data-testid="home-page">
      <h1>Daily Journal</h1>
      <p data-testid="entry-count">Total entries: {entries.length}</p>
      <div data-testid="recent-entries">
        {recent.map((e) => (
          <div key={e.id} data-testid={`recent-entry-${e.id}`}>
            <span data-testid="recent-title">{e.title}</span>
            <span data-testid="recent-mood">{e.mood}</span>
          </div>
        ))}
      </div>
      <button data-testid="go-new-entry" onClick={() => navigate("new-entry")}>
        Write Today
      </button>
    </div>
  );
}

function EntriesPage() {
  const { entries, selectEntry, navigate } = useApp();
  const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);
  return (
    <div data-testid="entries-page">
      <h2>All Entries</h2>
      {sorted.length === 0 && <p data-testid="no-entries">No entries yet.</p>}
      <ul data-testid="entries-list">
        {sorted.map((e) => (
          <li key={e.id} data-testid={`entry-item-${e.id}`}>
            <span data-testid="entry-title">{e.title}</span>
            <span data-testid="entry-date">{e.date}</span>
            <span data-testid="entry-mood">{e.mood}</span>
            <button
              data-testid={`delete-entry-${e.id}`}
              onClick={async () => {
                await fetch(`/api/entries?id=${e.id}`, { method: "DELETE" });
                const res = await fetch("/api/entries");
                const data = await res.json() as { entries: JournalEntry[] };
                // trigger re-fetch via parent
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewEntryPage() {
  const { navigate, setEntries } = useApp();
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [mood, setMood] = React.useState("good");
  const [tags, setTags] = React.useState("");
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Title and body are required.");
      return;
    }
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        body,
        mood,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        date: new Date().toISOString().slice(0, 10),
      }),
    });
    if (res.ok) {
      const all = await fetch("/api/entries");
      const data = await all.json() as { entries: JournalEntry[] };
      setEntries(data.entries);
      navigate("entries");
    }
  }

  return (
    <div data-testid="new-entry-page">
      <h2>New Entry</h2>
      {error && <p data-testid="form-error">{error}</p>}
      <form onSubmit={handleSubmit} data-testid="new-entry-form">
        <input
          data-testid="input-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          data-testid="input-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What happened today?"
        />
        <select data-testid="input-mood" value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="great">Great</option>
          <option value="good">Good</option>
          <option value="okay">Okay</option>
          <option value="bad">Bad</option>
          <option value="terrible">Terrible</option>
        </select>
        <input
          data-testid="input-tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
        />
        <button type="submit" data-testid="submit-entry">Save Entry</button>
      </form>
    </div>
  );
}

function SearchPage() {
  const { setEntries } = useApp();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<JournalEntry[]>([]);
  const [searched, setSearched] = React.useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/entries?search=${encodeURIComponent(query)}`);
    const data = await res.json() as { entries: JournalEntry[] };
    setResults(data.entries);
    setSearched(true);
  }

  return (
    <div data-testid="search-page">
      <h2>Search Entries</h2>
      <form onSubmit={handleSearch} data-testid="search-form">
        <input
          data-testid="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
        />
        <button type="submit" data-testid="search-btn">Search</button>
      </form>
      {searched && results.length === 0 && (
        <p data-testid="no-results">No results found.</p>
      )}
      <ul data-testid="search-results">
        {results.map((e) => (
          <li key={e.id} data-testid={`search-result-${e.id}`}>
            <span data-testid="result-title">{e.title}</span>
            <span data-testid="result-mood">{e.mood}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Shell() {
  const { route, setEntries } = useApp();

  useEffect(() => {
    fetch("/api/entries")
      .then((r) => r.json())
      .then((data: { entries: JournalEntry[] }) => setEntries(data.entries))
      .catch(() => {});
  }, []);

  return (
    <div data-testid="app-shell">
      <NavBar />
      {route === "home" && <HomePage />}
      {route === "entries" && <EntriesPage />}
      {route === "new-entry" && <NewEntryPage />}
      {route === "search" && <SearchPage />}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}
