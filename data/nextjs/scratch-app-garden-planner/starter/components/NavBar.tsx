'use client';
import React from 'react';
export function NavBar() {
  return <nav>
    <button data-testid="nav-home" data-active="false">Home</button>
    <button data-testid="nav-plants" data-active="false">Plants</button>
    <button data-testid="nav-beds" data-active="false">Beds</button>
    <button data-testid="nav-log" data-active="false">Log</button>
  </nav>;
}
