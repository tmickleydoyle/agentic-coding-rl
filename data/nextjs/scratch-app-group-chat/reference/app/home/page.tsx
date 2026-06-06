'use client';
import React, { useEffect, useState } from 'react';
import { Room } from '../../lib/types';

export function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetch('/api/rooms').then((r) => r.json()).then(setRooms);
  }, []);

  const totalMessages = rooms.reduce((s, r) => s + r.messages.length, 0);
  const members = new Set<string>();
  rooms.forEach((r) => r.members.forEach((m) => members.add(m)));

  return (
    <div data-testid="home-page">
      <h1>Group Chat</h1>
      <div data-testid="stat-rooms">Rooms: {rooms.length}</div>
      <div data-testid="stat-messages">Messages: {totalMessages}</div>
      <div data-testid="stat-members">Active Members: {members.size}</div>
    </div>
  );
}
