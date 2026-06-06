import { useState } from "react";

interface Show {
  id: number;
  name: string;
  host: string;
  category: string;
  episodes: number;
  subscribed: boolean;
}

const SEED_SHOWS: Show[] = [
  { id: 1, name: "Conan O'Brien Needs a Friend", host: "Conan O'Brien", category: "Comedy", episodes: 210, subscribed: true },
  { id: 2, name: "Serial", host: "Sarah Koenig", category: "True Crime", episodes: 42, subscribed: true },
  { id: 3, name: "Planet Money", host: "Various", category: "Economics", episodes: 900, subscribed: false },
];

let nextId = 4;

export default function App() {
  const [shows, setShows] = useState<Show[]>(SEED_SHOWS);
  const [name, setName] = useState("");
  const [host, setHost] = useState("");
  const [category, setCategory] = useState("");
  const [episodes, setEpisodes] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    const ep = parseInt(episodes, 10);
    if (!name.trim() || !host.trim() || !category.trim() || !episodes.trim() || isNaN(ep) || ep <= 0) {
      setError("Invalid input");
      return;
    }
    setShows([...shows, { id: nextId++, name: name.trim(), host: host.trim(), category: category.trim(), episodes: ep, subscribed: false }]);
    setName("");
    setHost("");
    setCategory("");
    setEpisodes("");
    setError("");
  }

  function handleToggle(id: number) {
    setShows(shows.map((s) => s.id === id ? { ...s, subscribed: !s.subscribed } : s));
  }

  function handleDelete(id: number) {
    setShows(shows.filter((s) => s.id !== id));
  }

  const subscribedCount = shows.filter((s) => s.subscribed).length;

  return (
    <div>
      <h1>Show Tracker</h1>
      <div data-testid="show-count">{shows.length} shows</div>
      <div data-testid="subscribed-count">{subscribedCount} subscribed</div>
      <div>
        <label htmlFor="name-input">Name</label>
        <input id="name-input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="host-input">Host</label>
        <input id="host-input" value={host} onChange={(e) => setHost(e.target.value)} />
      </div>
      <div>
        <label htmlFor="category-input">Category</label>
        <input id="category-input" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div>
        <label htmlFor="episodes-input">Episodes</label>
        <input id="episodes-input" value={episodes} onChange={(e) => setEpisodes(e.target.value)} type="number" />
      </div>
      <button onClick={handleAdd}>Add Show</button>
      {error && <div data-testid="error-message">{error}</div>}
      <ul>
        {shows.map((s) => (
          <li key={s.id} data-testid="show-card">
            <span data-testid="show-name">{s.name}</span>
            <span data-testid="show-host">{s.host}</span>
            <span data-testid="show-category">{s.category}</span>
            <span data-testid="show-episodes">{s.episodes}</span>
            <span data-testid="show-subscribed">{s.subscribed ? "subscribed" : "not subscribed"}</span>
            <button onClick={() => handleToggle(s.id)}>{s.subscribed ? "Unsubscribe" : "Subscribe"}</button>
            <button onClick={() => handleDelete(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
