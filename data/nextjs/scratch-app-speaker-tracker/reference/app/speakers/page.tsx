import React, { useState } from "react";
import { getSpeakers, addSpeaker, toggleFollow } from "../../lib/store";

export function SpeakersPage() {
  const [followingOnly, setFollowingOnly] = useState(false);
  const [name, setName] = useState("");
  const [expertise, setExpertise] = useState("");
  const [bio, setBio] = useState("");
  const [, forceUpdate] = useState(0);

  const speakers = getSpeakers();
  const filtered = followingOnly ? speakers.filter((s) => s.following) : speakers;

  const handleAdd = () => {
    if (!name.trim()) return;
    const expertiseArr = expertise.split(",").map((e) => e.trim()).filter(Boolean);
    addSpeaker({ name: name.trim(), expertise: expertiseArr, bio: bio.trim() });
    setName(""); setExpertise(""); setBio("");
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="speakers-page">
      <h2>Speakers</h2>
      <label>
        <input
          type="checkbox"
          data-testid="following-filter"
          checked={followingOnly}
          onChange={(e) => setFollowingOnly(e.target.checked)}
        />
        Following only
      </label>
      {filtered.map((s) => (
        <div key={s.id} data-testid="speaker-item">
          <span data-testid="speaker-name">{s.name}</span>
          <span data-testid="speaker-bio">{s.bio}</span>
          <span data-testid="speaker-expertise">{s.expertise.join(", ")}</span>
          <button
            data-testid="follow-btn"
            onClick={() => { toggleFollow(s.id); forceUpdate((n) => n + 1); }}
          >
            {s.following ? "Unfollow" : "Follow"}
          </button>
        </div>
      ))}
      <div data-testid="add-speaker-form">
        <input data-testid="speaker-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="speaker-expertise-input" value={expertise} onChange={(e) => setExpertise(e.target.value)} placeholder="AI, MLOps" />
        <input data-testid="speaker-bio-input" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" />
        <button data-testid="add-speaker-btn" onClick={handleAdd}>Add Speaker</button>
      </div>
    </div>
  );
}
