'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function SkillsPage() {
  const { skills, certificates, setSkills } = useApp();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [requiredHours, setRequiredHours] = useState('');

  async function handleAdd() {
    if (!name.trim() || !category || !requiredHours) return;
    const res = await fetch('/api/certificates?type=skill', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, category, requiredHours: Number(requiredHours) }) });
    if (res.ok) { const skill = await res.json(); setSkills([...skills, skill]); setName(''); setCategory(''); setRequiredHours(''); }
  }

  async function handleDelete(id: number) {
    const res = await fetch('/api/certificates?type=skill', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (res.ok || res.status === 204) setSkills(skills.filter((s) => s.id !== id));
  }

  return (
    <div data-testid="skills-page">
      <h2>Skills</h2>
      <ul data-testid="skill-list">
        {skills.map((s) => {
          const hasCerts = certificates.some((c) => c.skillId === s.id);
          return (
            <li key={s.id} data-testid={`skill-${s.id}`}>
              <span data-testid={`skill-name-${s.id}`}>{s.name}</span>
              <span data-testid={`skill-category-${s.id}`}>{s.category}</span>
              <span data-testid={`skill-hours-${s.id}`}>{s.requiredHours}h</span>
              {!hasCerts && <button data-testid={`delete-skill-${s.id}`} onClick={() => handleDelete(s.id)}>Delete</button>}
            </li>
          );
        })}
      </ul>
      <div data-testid="add-skill-form">
        <input data-testid="skill-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Skill name" />
        <input data-testid="skill-category-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
        <input data-testid="skill-hours-input" type="number" value={requiredHours} onChange={(e) => setRequiredHours(e.target.value)} placeholder="Required hours" />
        <button data-testid="add-skill-btn" onClick={handleAdd}>Add Skill</button>
      </div>
    </div>
  );
}
