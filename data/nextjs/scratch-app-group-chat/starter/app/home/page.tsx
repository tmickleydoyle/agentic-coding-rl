'use client';
import React from 'react';

export function HomePage() {
  return (
    <div data-testid="home-page">
      <h1>Group Chat</h1>
      <div data-testid="stat-rooms">Rooms: 0</div>
      <div data-testid="stat-messages">Messages: 0</div>
      <div data-testid="stat-members">Active Members: 0</div>
    </div>
  );
}
