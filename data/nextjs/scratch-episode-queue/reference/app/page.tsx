import { useState } from "react";

interface Episode {
  id: number;
  show: string;
  title: string;
  duration: string;
  status: "queued" | "listened";
}

const SEED_EPISODES: Episode[] = [
  { id: 1, show: "99% Invisible", title: "The Pool and the Stream", duration: "42:15", status: "queued" },
  { id: 2, show: "Radiolab", title: "Ripple Effect", duration: "55:03", status: "queued" },
  { id: 3, show: "This American Life", title: "The Problem We All Live With", duration: "59:47", status: "listened" },
];

let nextId = 4;

type Filter = "All" | "Queued" | "Listened";

export default function App() {
  const [episodes, setEpisodes] = useState<Episode[]>(SEED_EPISODES);
  const [show, setShow] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  function handleAdd() {
    if (!show.trim() || !title.trim() || !duration.trim()) {
      setError("All fields are required");
      return;
    }
    setEpisodes([...episodes, { id: nextId++, show: show.trim(), title: title.trim(), duration: duration.trim(), status: "queued" }]);
    setShow("");
    setTitle("");
    setDuration("");
    setError("");
  }

  function handleMarkListened(id: number) {
    setEpisodes(episodes.map((e) => e.id === id ? { ...e, status: "listened" } : e));
  }

  function handleRemove(id: number) {
    setEpisodes(episodes.filter((e) => e.id !== id));
  }

  const visible = episodes.filter((e) => {
    if (filter === "Queued") return e.status === "queued";
    if (filter === "Listened") return e.status === "listened";
    return true;
  });

  const queuedCount = episodes.filter((e) => e.status === "queued").length;

  return (
    <div>
      <h1>Episode Queue</h1>
      <div data-testid="queue-count">{queuedCount} queued</div>
      <div>
        <label htmlFor="show-input">Show</label>
        <input id="show-input" value={show} onChange={(e) => setShow(e.target.value)} />
      </div>
      <div>
        <label htmlFor="title-input">Title</label>
        <input id="title-input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="duration-input">Duration</label>
        <input id="duration-input" value={duration} onChange={(e) => setDuration(e.target.value)} />
      </div>
      <button onClick={handleAdd}>Add Episode</button>
      {error && <div data-testid="error-message">{error}</div>}
      <div>
        {(["All", "Queued", "Listened"] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <ul>
        {visible.map((ep) => (
          <li key={ep.id} data-testid="episode-card">
            <span data-testid="episode-show">{ep.show}</span>
            <span data-testid="episode-title">{ep.title}</span>
            <span data-testid="episode-duration">{ep.duration}</span>
            <span data-testid="episode-status">{ep.status}</span>
            {ep.status === "queued" && (
              <button onClick={() => handleMarkListened(ep.id)}>Mark Listened</button>
            )}
            <button onClick={() => handleRemove(ep.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
