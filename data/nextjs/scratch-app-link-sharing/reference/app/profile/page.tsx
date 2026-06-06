'use client';
import React, { useEffect, useState } from 'react';
import { Link } from '../../lib/types';
import { useApp } from '../../components/AppStateProvider';

export function ProfilePage() {
  const { selectedUser } = useApp();
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    fetch('/api/links').then((r) => r.json()).then(setLinks);
  }, []);

  const userLinks = links.filter((l) => l.submitter === selectedUser);

  return (
    <div data-testid="profile-page">
      <h1 data-testid="profile-username">{selectedUser ?? 'No user'}</h1>
      <div data-testid="profile-link-count">Links: {userLinks.length}</div>
      <div data-testid="profile-links">
        {userLinks.map((l) => (
          <div key={l.id} data-testid={`profile-link-${l.id}`}>{l.title}</div>
        ))}
      </div>
    </div>
  );
}
