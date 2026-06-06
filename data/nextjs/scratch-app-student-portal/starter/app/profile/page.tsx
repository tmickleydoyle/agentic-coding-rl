'use client'
import React from 'react';

export function ProfilePage() {
  return (
    <div data-testid="profile-page">
      <h2>Profile</h2>
      <p data-testid="profile-name"></p>
      <p data-testid="profile-email"></p>
      <p data-testid="profile-grade"></p>
      <div data-testid="profile-form">
        <input data-testid="profile-name-input" />
        <button data-testid="profile-save-btn">Save</button>
      </div>
    </div>
  );
}
