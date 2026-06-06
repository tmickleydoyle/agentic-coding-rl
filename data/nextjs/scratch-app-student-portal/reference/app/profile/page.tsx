'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function ProfilePage() {
  const { student, setStudent } = useApp();
  const [name, setName] = useState(student.name);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    const res = await fetch('/api/portal?type=profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
    if (res.ok) { setStudent({ ...student, name }); setSaved(true); }
  }

  return (
    <div data-testid="profile-page">
      <h2>Profile</h2>
      <p data-testid="profile-name">{student.name}</p>
      <p data-testid="profile-email">{student.email}</p>
      <p data-testid="profile-grade">{student.grade}</p>
      {saved && <p data-testid="profile-saved">Profile updated</p>}
      <div data-testid="profile-form">
        <input data-testid="profile-name-input" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} />
        <button data-testid="profile-save-btn" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}
