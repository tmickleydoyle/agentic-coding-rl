'use client';
import React from 'react';

export function RoomPage() {
  return (
    <div data-testid="room-page">
      <h1 data-testid="room-name"></h1>
      <div data-testid="members-list"></div>
      <div data-testid="messages-list"></div>
      <input data-testid="author-input" placeholder="Your name" />
      <input data-testid="message-input" placeholder="Message..." />
      <button data-testid="send-btn">Send</button>
    </div>
  );
}
