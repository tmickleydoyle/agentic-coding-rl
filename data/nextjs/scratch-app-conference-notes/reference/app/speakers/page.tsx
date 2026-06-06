import React, { useState } from "react";
import { getSpeakers, addSpeaker, getTalks } from "../../lib/store";

export function SpeakersPage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [twitter, setTwitter] = useState("");
  const [, forceUpdate] = useState(0);

  const speakers = getSpeakers();
  const talks = getTalks();

  const handleAdd = () => {
    if (!name.trim()) return;
    addSpeaker({ name: name.trim(), bio: bio.trim(), twitter: twitter.trim() });
    setName(""); setBio(""); setTwitter("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="speakers-page">
      <h2>Speakers</h2>
      {speakers.map((s) => {
        const talkCount = talks.filter((t) => t.speakerId === s.id).length;
        return (
          <div key={s.id} data-testid="speaker-item">
            <span data-testid="speaker-name">{s.name}</span>
            <span data-testid="speaker-bio">{s.bio}</span>
            <span data-testid="speaker-twitter">{s.twitter}</span>
            <span data-testid="speaker-talk-count">{talkCount}</span>
          </div>
        );
      })}
      <div data-testid="add-speaker-form">
        <input data-testid="speaker-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="speaker-bio-input" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" />
        <input data-testid="speaker-twitter-input" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="Twitter" />
        <button data-testid="add-speaker-btn" onClick={handleAdd}>Add Speaker</button>
      </div>
    </div>
  );
}
