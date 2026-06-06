'use client';
import React, { useEffect, useState } from 'react';
import { Room } from '../../lib/types';
import { useApp } from '../../components/AppStateProvider';

export function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const { navigate, setSelectedRoomId } = useApp();

  useEffect(() => {
    fetch('/api/rooms').then((r) => r.json()).then(setRooms);
  }, []);

  return (
    <div data-testid="rooms-page">
      <h1>Rooms</h1>
      {rooms.map((r) => (
        <div key={r.id} data-testid={`room-row-${r.id}`}>
          <button data-testid={`room-link-${r.id}`} onClick={() => { setSelectedRoomId(r.id); navigate('room'); }}>
            {r.name}
          </button>
          <span data-testid={`room-desc-${r.id}`}>{r.description}</span>
          <span data-testid={`room-members-${r.id}`}>{r.members.length} members</span>
          <span data-testid={`room-messages-${r.id}`}>{r.messages.length} messages</span>
        </div>
      ))}
    </div>
  );
}
