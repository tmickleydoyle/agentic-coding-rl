'use client';
import React from 'react';

export function NavBar() {
  return (
    <nav>
      <button data-testid="nav-home" data-active="false">Home</button>
      <button data-testid="nav-clients" data-active="false">Clients</button>
      <button data-testid="nav-projects" data-active="false">Projects</button>
      <button data-testid="nav-invoices" data-active="false">Invoices</button>
    </nav>
  );
}
