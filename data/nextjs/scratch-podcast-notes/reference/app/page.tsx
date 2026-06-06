import { useState } from "react";

interface PodcastNote {
  id: number;
  podcast: string;
  episode: string;
  note: string;
  timestamp: string;
}

const SEED_NOTES: PodcastNote[] = [
  { id: 1, podcast: "Lex Fridman Podcast", episode: "EP #400 - Elon Musk", note: "Interesting discussion on AI timelines", timestamp: "12:34" },
  { id: 2, podcast: "Hardcore History", episode: "Blueprint for Armageddon", note: "WWI causes explained brilliantly", timestamp: "45:10" },
  { id: 3, podcast: "Huberman Lab", episode: "Sleep Toolkit", note: "20 min nap before 3pm rule", timestamp: "08:22" },
];

let nextId = 4;

export default function App() {
  const [notes, setNotes] = useState<PodcastNote[]>(SEED_NOTES);
  const [podcast, setPodcast] = useState("");
  const [episode, setEpisode] = useState("");
  const [note, setNote] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!podcast.trim() || !episode.trim() || !note.trim() || !timestamp.trim()) {
      setError("All fields are required");
      return;
    }
    setNotes([...notes, { id: nextId++, podcast: podcast.trim(), episode: episode.trim(), note: note.trim(), timestamp: timestamp.trim() }]);
    setPodcast("");
    setEpisode("");
    setNote("");
    setTimestamp("");
    setError("");
  }

  function handleDelete(id: number) {
    setNotes(notes.filter((n) => n.id !== id));
  }

  return (
    <div>
      <h1>Podcast Notes</h1>
      <div data-testid="note-count">{notes.length} notes</div>
      <div>
        <label htmlFor="podcast-input">Podcast</label>
        <input id="podcast-input" value={podcast} onChange={(e) => setPodcast(e.target.value)} />
      </div>
      <div>
        <label htmlFor="episode-input">Episode</label>
        <input id="episode-input" value={episode} onChange={(e) => setEpisode(e.target.value)} />
      </div>
      <div>
        <label htmlFor="note-input">Note</label>
        <input id="note-input" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <div>
        <label htmlFor="timestamp-input">Timestamp</label>
        <input id="timestamp-input" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} />
      </div>
      <button onClick={handleAdd}>Add Note</button>
      {error && <div data-testid="error-message">{error}</div>}
      <ul>
        {notes.map((n) => (
          <li key={n.id} data-testid="note-card">
            <span data-testid="note-podcast">{n.podcast}</span>
            <span data-testid="note-episode">{n.episode}</span>
            <span data-testid="note-text">{n.note}</span>
            <span data-testid="note-timestamp">{n.timestamp}</span>
            <button onClick={() => handleDelete(n.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
