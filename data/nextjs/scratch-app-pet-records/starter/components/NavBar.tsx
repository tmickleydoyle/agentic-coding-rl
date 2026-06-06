'use client';
import React from 'react';
export function NavBar() {
  return <nav>
    <button data-testid="nav-home" data-active="false">Home</button>
    <button data-testid="nav-pets" data-active="false">Pets</button>
    <button data-testid="nav-visits" data-active="false">Visits</button>
    <button data-testid="nav-medications" data-active="false">Medications</button>
  </nav>;
}
