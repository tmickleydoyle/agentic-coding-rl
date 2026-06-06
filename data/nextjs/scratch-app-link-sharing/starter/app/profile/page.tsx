'use client';
import React from 'react';

export function ProfilePage() {
  return (
    <div data-testid="profile-page">
      <h1 data-testid="profile-username">No user</h1>
      <div data-testid="profile-link-count">Links: 0</div>
      <div data-testid="profile-links"></div>
    </div>
  );
}
