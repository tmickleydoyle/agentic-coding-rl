'use client';
import React from 'react';

export function NavBar() {
  return (
    <nav>
      <button data-testid="nav-home" data-active="false">Home</button>
      <button data-testid="nav-subscriptions" data-active="false">Subscriptions</button>
      <button data-testid="nav-calendar" data-active="false">Calendar</button>
      <button data-testid="nav-stats" data-active="false">Stats</button>
    </nav>
  );
}
