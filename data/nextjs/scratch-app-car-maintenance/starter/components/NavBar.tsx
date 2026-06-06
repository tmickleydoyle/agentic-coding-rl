'use client';
import React from 'react';
export function NavBar() {
  return <nav>
    <button data-testid="nav-home" data-active="false">Home</button>
    <button data-testid="nav-vehicles" data-active="false">Vehicles</button>
    <button data-testid="nav-service" data-active="false">Service</button>
    <button data-testid="nav-reminders" data-active="false">Reminders</button>
  </nav>;
}
