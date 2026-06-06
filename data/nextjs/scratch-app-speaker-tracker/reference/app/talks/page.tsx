import React, { useState } from "react";
import { getTalks, getSpeakers, markWatched, setRating } from "../../lib/store";

export function TalksPage() {
  const [speakerFilter, setSpeakerFilter] = useState("all");
  const [unwatchedOnly, setUnwatchedOnly] = useState(false);
  const [, forceUpdate] = useState(0);

  const speakers = getSpeakers();
  const talks = getTalks();
  const speakerMap = new Map<string, string>();
  speakers.forEach((s) => speakerMap.set(s.id, s.name));

  const filtered = talks.filter((t) => {
    const matchSpeaker = speakerFilter === "all" || t.speakerId === speakerFilter;
    const matchWatched = !unwatchedOnly || !t.watched;
    return matchSpeaker && matchWatched;
  });

  return (
    <div data-testid="talks-page">
      <h2>Talks</h2>
      <select data-testid="speaker-filter" value={speakerFilter} onChange={(e) => setSpeakerFilter(e.target.value)}>
        <option value="all">All</option>
        {speakers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <button
        data-testid="filter-unwatched"
        onClick={() => setUnwatchedOnly((v) => !v)}
      >
        {unwatchedOnly ? "Show All" : "Unwatched Only"}
      </button>
      {filtered.map((t) => (
        <div key={t.id} data-testid="talk-item">
          <span data-testid="talk-title">{t.title}</span>
          <span data-testid="talk-event">{t.eventName}</span>
          <span data-testid="talk-speaker">{speakerMap.get(t.speakerId) ?? ""}</span>
          {t.watched && <span data-testid="watched-badge">Watched</span>}
          {!t.watched && (
            <button data-testid="mark-watched" onClick={() => { markWatched(t.id); forceUpdate((n) => n + 1); }}>
              Mark Watched
            </button>
          )}
          {t.watched && (
            <select
              data-testid="rating-select"
              value={t.rating}
              onChange={(e) => { setRating(t.id, parseInt(e.target.value)); forceUpdate((n) => n + 1); }}
            >
              <option value={0}>Unrated</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          )}
        </div>
      ))}
    </div>
  );
}
