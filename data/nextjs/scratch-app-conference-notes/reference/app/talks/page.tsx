import React, { useState } from "react";
import { getTalks, getConferences, getSpeakers, addTalk } from "../../lib/store";

export function TalksPage() {
  const [confFilter, setConfFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [confId, setConfId] = useState("");
  const [speakerId, setSpeakerId] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState("4");
  const [, forceUpdate] = useState(0);

  const conferences = getConferences();
  const speakers = getSpeakers();
  const talks = getTalks();
  const speakerMap = new Map<string, string>();
  speakers.forEach((s) => speakerMap.set(s.id, s.name));

  const filtered = talks.filter((t) => {
    const matchConf = confFilter === "all" || t.conferenceId === confFilter;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    return matchConf && matchSearch;
  });

  const handleAdd = () => {
    if (!confId || !speakerId || !title.trim()) return;
    addTalk({ conferenceId: confId, speakerId, title: title.trim(), notes: notes.trim(), rating: parseInt(rating), tags: [] });
    setTitle(""); setNotes("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="talks-page">
      <h2>Talks</h2>
      <input data-testid="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or tag" />
      <select data-testid="conference-filter" value={confFilter} onChange={(e) => setConfFilter(e.target.value)}>
        <option value="all">All</option>
        {conferences.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      {filtered.map((t) => (
        <div key={t.id} data-testid="talk-item">
          <span data-testid="talk-title">{t.title}</span>
          <span data-testid="talk-rating">{t.rating}</span>
          <span data-testid="talk-tags">{t.tags.join(", ")}</span>
          <span data-testid="talk-speaker">{speakerMap.get(t.speakerId) ?? ""}</span>
        </div>
      ))}
      <div data-testid="add-talk-form">
        <select data-testid="talk-conf-select" value={confId} onChange={(e) => setConfId(e.target.value)}>
          <option value="">Select conference</option>
          {conferences.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select data-testid="talk-speaker-select" value={speakerId} onChange={(e) => setSpeakerId(e.target.value)}>
          <option value="">Select speaker</option>
          {speakers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input data-testid="talk-title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea data-testid="talk-notes-input" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <input data-testid="talk-rating-input" type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
        <button data-testid="add-talk-btn" onClick={handleAdd}>Add Talk</button>
      </div>
    </div>
  );
}
