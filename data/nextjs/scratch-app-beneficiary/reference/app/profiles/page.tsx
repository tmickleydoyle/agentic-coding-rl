import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export function ProfilesPage() {
  const { profiles, addProfile, deleteProfile } = useApp();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");

  const handleAdd = () => {
    if (!name) return;
    addProfile({ name, dob, email });
    setName(""); setDob(""); setEmail("");
  };

  return (
    <div data-testid="profiles-page">
      <h1>Beneficiary Profiles</h1>
      {profiles.length === 0 ? (
        <p data-testid="no-profiles">No profiles found.</p>
      ) : (
        <ul data-testid="profile-list">
          {profiles.map((p) => (
            <li key={p.id} data-testid={`profile-item-${p.id}`}>
              <span data-testid={`profile-name-${p.id}`}>{p.name}</span>
              <span data-testid={`profile-dob-${p.id}`}>{p.dob}</span>
              <span data-testid={`profile-email-${p.id}`}>{p.email}</span>
              <button data-testid={`delete-profile-${p.id}`} onClick={() => deleteProfile(p.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <div data-testid="add-profile-form">
        <input data-testid="profile-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="profile-dob-input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        <input data-testid="profile-email-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button data-testid="add-profile-btn" onClick={handleAdd}>Add Profile</button>
      </div>
    </div>
  );
}
