'use client';
import React, { useEffect, useState } from 'react';
import { Room } from '../../lib/types';
import { useApp } from '../../components/AppStateProvider';

export function ProfilePage() {
  const { selectedUser } = useApp();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetch('/api/rooms').then((r) => r.json()).then(setRooms);
  }, []);

  const messages = rooms.flatMap((r) => r.messages.filter((m) => m.author === selectedUser).map((m) => ({ ...m, room: r.name })));

  return (
    <div data-testid="profile-page">
      <h1 data-testid="profile-username">{selectedUser ?? 'No user'}</h1>
      <div data-testid="profile-message-count">Messages: {messages.length}</div>
      <div data-testid="profile-messages">
        {messages.map((m) => (
          <div key={m.id} data-testid={`profile-msg-${m.id}`}>
            <span>[{m.room}] {m.body}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
