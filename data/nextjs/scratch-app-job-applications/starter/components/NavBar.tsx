'use client';
import React from 'react';

export function NavBar() {
  return (
    <nav>
      <button data-testid="nav-home" data-active="false">Home</button>
      <button data-testid="nav-applications" data-active="false">Applications</button>
      <button data-testid="nav-contacts" data-active="false">Contacts</button>
      <button data-testid="nav-notes" data-active="false">Notes</button>
    </nav>
  );
}
