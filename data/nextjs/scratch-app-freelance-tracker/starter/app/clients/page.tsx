'use client';
import React from 'react';

export function ClientsPage() {
  return (
    <div>
      <h2>Clients</h2>
      <form data-testid="client-add-form">
        <input data-testid="client-name-input" placeholder="Name" />
        <input data-testid="client-email-input" placeholder="Email" />
        <button data-testid="client-submit" type="submit">Add Client</button>
      </form>
      <ul data-testid="client-list"></ul>
    </div>
  );
}
