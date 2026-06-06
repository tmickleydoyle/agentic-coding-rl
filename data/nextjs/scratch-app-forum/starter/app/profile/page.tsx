'use client';
import React from 'react';

export function ProfilePage() {
  return (
    <div data-testid="profile-page">
      <h1 data-testid="profile-username">No user selected</h1>
      <div data-testid="profile-reply-count">Replies: 0</div>
      <div data-testid="profile-threads"></div>
    </div>
  );
}
