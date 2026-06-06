import { useState } from "react";

type Track = "Keynote" | "Frontend" | "Backend" | "Design";

interface Session {
  id: number;
  title: string;
  speaker: string;
  track: Track;
  day: number;
  time: string;
  room: string;
  duration: number;
}

const SESSIONS: Session[] = [
  { id: 1, title: "Keynote: Future of AI", speaker: "Dr. Ada Lovelace", track: "Keynote", day: 1, time: "09:00", room: "Main Hall", duration: 60 },
  { id: 2, title: "React Patterns in 2025", speaker: "Jordan Lee", track: "Frontend", day: 1, time: "11:00", room: "Room A", duration: 45 },
  { id: 3, title: "Scaling Microservices", speaker: "Sam Rivera", track: "Backend", day: 1, time: "11:00", room: "Room B", duration: 45 },
  { id: 4, title: "Designing for Accessibility", speaker: "Priya Nair", track: "Design", day: 1, time: "14:00", room: "Room C", duration: 45 },
  { id: 5, title: "GraphQL Best Practices", speaker: "Carlos Diaz", track: "Backend", day: 2, time: "10:00", room: "Room B", duration: 45 },
  { id: 6, title: "CSS Architecture", speaker: "Mia Chen", track: "Frontend", day: 2, time: "13:00", room: "Room A", duration: 45 },
];

const TRACKS: Array<Track | "All"> = ["All", "Keynote", "Frontend", "Backend", "Design"];

export default function App() {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [activeTrack, setActiveTrack] = useState<Track | "All">("All");
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [bookmarksOnly, setBookmarksOnly] = useState<boolean>(false);

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filtered = SESSIONS.filter((s) => {
    if (s.day !== activeDay) return false;
    if (activeTrack !== "All" && s.track !== activeTrack) return false;
    if (bookmarksOnly && !bookmarks.has(s.id)) return false;
    return true;
  });

  return (
    <main>
      <h1>Conference Schedule</h1>

      <div role="tablist" aria-label="Conference days">
        {[1, 2].map((day) => (
          <button
            key={day}
            role="tab"
            aria-selected={activeDay === day}
            data-testid={`day-tab-${day}`}
            onClick={() => setActiveDay(day)}
          >
            Day {day}
          </button>
        ))}
      </div>

      <div data-testid="track-filters">
        {TRACKS.map((track) => (
          <button
            key={track}
            aria-pressed={activeTrack === track}
            data-testid={`track-filter-${track.toLowerCase()}`}
            onClick={() => setActiveTrack(track)}
          >
            {track}
          </button>
        ))}
      </div>

      <label>
        <input
          type="checkbox"
          data-testid="bookmarks-only-toggle"
          checked={bookmarksOnly}
          onChange={(e) => setBookmarksOnly(e.target.checked)}
        />
        Bookmarks Only
      </label>

      <p data-testid="session-count">Showing {filtered.length} sessions</p>

      {filtered.length === 0 ? (
        <p data-testid="no-sessions">No sessions found</p>
      ) : (
        <ul data-testid="session-list">
          {filtered.map((session) => (
            <li key={session.id} data-testid={`session-${session.id}`}>
              <span data-testid={`session-title-${session.id}`}>{session.title}</span>
              <span data-testid={`session-speaker-${session.id}`}>{session.speaker}</span>
              <span data-testid={`session-time-${session.id}`}>{session.time}</span>
              <span data-testid={`session-room-${session.id}`}>{session.room}</span>
              <span data-testid={`session-duration-${session.id}`}>{session.duration} min</span>
              <span data-testid={`session-track-${session.id}`}>{session.track}</span>
              <button
                data-testid={`bookmark-btn-${session.id}`}
                aria-pressed={bookmarks.has(session.id)}
                onClick={() => toggleBookmark(session.id)}
              >
                {bookmarks.has(session.id) ? "Bookmarked" : "Bookmark"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
