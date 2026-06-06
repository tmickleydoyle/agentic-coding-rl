'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function IssuedPage() {
  const { skills, certificates } = useApp();
  const categories = Array.from(new Set(skills.map((s) => s.category)));
  const [filterCat, setFilterCat] = useState('all');

  const filteredSkills = filterCat === 'all' ? skills : skills.filter((s) => s.category === filterCat);
  const uniqueRecipients = new Set(certificates.map((c) => c.recipientName));

  return (
    <div data-testid="issued-page">
      <h2>Issued</h2>
      <p data-testid="unique-recipients">Recipients: {uniqueRecipients.size}</p>
      <select data-testid="category-filter" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
        <option value="all">All</option>
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <ul data-testid="issued-list">
        {filteredSkills.map((s) => {
          const count = certificates.filter((c) => c.skillId === s.id).length;
          return (
            <li key={s.id} data-testid={`issued-${s.id}`}>
              <span data-testid={`issued-skill-${s.id}`}>{s.name}</span>
              <span data-testid={`issued-count-${s.id}`}>{count}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
