import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { AthleteInfo } from "../../lib/types";

export default function ProfilePage() {
  const { athleteInfo, saveAthleteInfo } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<AthleteInfo>({ ...athleteInfo });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    saveAthleteInfo(form);
    setEditing(false);
  }

  return (
    <div data-testid="profile-page">
      <h1>Athlete Profile</h1>
      {!editing ? (
        <div data-testid="profile-view">
          <p data-testid="profile-name">{athleteInfo.name}</p>
          <p data-testid="profile-sport">{athleteInfo.sport}</p>
          <p data-testid="profile-dob">{athleteInfo.dateOfBirth}</p>
          <p data-testid="profile-bio">{athleteInfo.bio}</p>
          <button data-testid="btn-edit-profile" onClick={() => { setForm({ ...athleteInfo }); setEditing(true); }}>Edit</button>
        </div>
      ) : (
        <form data-testid="profile-edit-form" onSubmit={handleSave}>
          <input data-testid="input-profile-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input data-testid="input-profile-sport" value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} />
          <input data-testid="input-profile-dob" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
          <textarea data-testid="input-profile-bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <button type="submit" data-testid="btn-save-profile">Save</button>
          <button type="button" data-testid="btn-cancel-profile" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
}
