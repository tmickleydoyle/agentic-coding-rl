'use client'
import React from 'react';
export function GroupsPage() {
  return (
    <main data-testid="groups-page">
      <h2>Groups</h2>
      <div data-testid="add-group-form">
        <input data-testid="group-name-input" placeholder="Group name" />
        <input data-testid="group-members-input" placeholder="Members (comma-separated)" />
        <button data-testid="add-group-btn">Add Group</button>
      </div>
      <ul data-testid="groups-list" />
    </main>
  );
}
