'use client';
import React from 'react';
export function NavBar() {
  return <nav>
    <button data-testid="nav-home" data-active="false">Home</button>
    <button data-testid="nav-log" data-active="false">Log</button>
    <button data-testid="nav-beans" data-active="false">Beans</button>
    <button data-testid="nav-stats" data-active="false">Stats</button>
  </nav>;
}
