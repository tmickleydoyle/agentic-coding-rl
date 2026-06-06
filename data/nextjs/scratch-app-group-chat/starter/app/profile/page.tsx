'use client';
import React from 'react';

export function ProfilePage() {
  return (
    <div data-testid="profile-page">
      <h1 data-testid="profile-username">No user</h1>
      <div data-testid="profile-message-count">Messages: 0</div>
      <div data-testid="profile-messages"></div>
    </div>
  );
}
