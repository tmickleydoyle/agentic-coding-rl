import { useState } from "react";

interface LogEntry {
  id: number;
  show: string;
  episode: string;
  date: string;
  rating: number;
  thoughts: string;
}

const SEED_ENTRIES: LogEntry[] = [
  { id: 1, show: "The Daily", episode: "The Election Results", date: "2024-11-06", rating: 5, thoughts: "Excellent breakdown of the results" },
  { id: 2, show: "Stuff You Should Know", episode: "How Caves Work", date: "2024-11-04", rating: 4, thoughts: "Very informative" },
  { id: 3, show: "My Favorite Murder", episode: "Mini Morbid Update", date: "2024-11-01", rating: 3, thoughts: "Lighter episode, still fun" },
];

let nextId = 4;

export default function App() {
  const [entries, setEntries] = useState<LogEntry[]>(SEED_ENTRIES);
  const [show, setShow] = useState("");
  const [episode, setEpisode] = useState("");
  const [date, setDate] = useState("");
  const [rating, setRating] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [error, setError] = useState("");

  function handleLog() {
    const r = parseInt(rating, 10);
    if (!show.trim() || !episode.trim() || !date.trim() || !thoughts.trim() || isNaN(r) || r < 1 || r > 5) {
      setError("Invalid input");
      return;
    }
    setEntries([...entries, { id: nextId++, show: show.trim(), episode: episode.trim(), date: date.trim(), rating: r, thoughts: thoughts.trim() }]);
    setShow("");
    setEpisode("");
    setDate("");
    setRating("");
    setThoughts("");
    setError("");
  }

  function handleDelete(id: number) {
    setEntries(entries.filter((e) => e.id !== id));
  }

  const avg = entries.length > 0 ? (entries.reduce((sum, e) => sum + e.rating, 0) / entries.length).toFixed(1) : "0.0";

  return (
    <div>
      <h1>Listen Log</h1>
      <div data-testid="log-count">{entries.length} entries</div>
      <div data-testid="avg-rating">Avg: {avg}</div>
      <div>
        <label htmlFor="show-input">Show</label>
        <input id="show-input" value={show} onChange={(e) => setShow(e.target.value)} />
      </div>
      <div>
        <label htmlFor="episode-input">Episode</label>
        <input id="episode-input" value={episode} onChange={(e) => setEpisode(e.target.value)} />
      </div>
      <div>
        <label htmlFor="date-input">Date</label>
        <input id="date-input" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <label htmlFor="rating-input">Rating</label>
        <input id="rating-input" type="number" value={rating} onChange={(e) => setRating(e.target.value)} />
      </div>
      <div>
        <label htmlFor="thoughts-input">Thoughts</label>
        <input id="thoughts-input" value={thoughts} onChange={(e) => setThoughts(e.target.value)} />
      </div>
      <button onClick={handleLog}>Log Episode</button>
      {error && <div data-testid="error-message">{error}</div>}
      <ul>
        {entries.map((e) => (
          <li key={e.id} data-testid="log-card">
            <span data-testid="log-show">{e.show}</span>
            <span data-testid="log-episode">{e.episode}</span>
            <span data-testid="log-date">{e.date}</span>
            <span data-testid="log-rating">{e.rating}</span>
            <span data-testid="log-thoughts">{e.thoughts}</span>
            <button onClick={() => handleDelete(e.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
