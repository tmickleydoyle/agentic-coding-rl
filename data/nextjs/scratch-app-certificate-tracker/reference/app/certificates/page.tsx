'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function CertificatesPage() {
  const { skills, certificates, setCertificates } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [skillId, setSkillId] = useState('');
  const [recipient, setRecipient] = useState('');
  const [hours, setHours] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  function skillName(id: number) {
    return skills.find((s) => s.id === id)?.name ?? 'Unknown';
  }

  async function handleIssue() {
    if (!skillId || !recipient || !hours || !date) return;
    const res = await fetch('/api/certificates?type=certificate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ skillId: Number(skillId), recipientName: recipient, issuedDate: date, hoursCompleted: Number(hours) }) });
    if (!res.ok) { const msg = await res.text(); setError(msg); return; }
    const cert = await res.json();
    setCertificates([...certificates, cert]);
    setShowForm(false); setSkillId(''); setRecipient(''); setHours(''); setDate(''); setError('');
  }

  return (
    <div data-testid="certificates-page">
      <h2>Certificates</h2>
      <button data-testid="issue-cert-btn" onClick={() => setShowForm(!showForm)}>Issue Certificate</button>
      {showForm && (
        <div data-testid="cert-form">
          {error && <p data-testid="cert-error">{error}</p>}
          <select data-testid="cert-skill-select" value={skillId} onChange={(e) => setSkillId(e.target.value)}>
            <option value="">Select skill</option>
            {skills.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input data-testid="cert-recipient-input" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Recipient name" />
          <input data-testid="cert-hours-input" type="number" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Hours" />
          <input data-testid="cert-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <button data-testid="cert-submit-btn" onClick={handleIssue}>Issue</button>
        </div>
      )}
      <ul data-testid="cert-list">
        {certificates.map((c) => (
          <li key={c.id} data-testid={`cert-${c.id}`}>
            <span data-testid={`cert-recipient-${c.id}`}>{c.recipientName}</span>
            <span data-testid={`cert-skill-${c.id}`}>{skillName(c.skillId)}</span>
            <span data-testid={`cert-date-${c.id}`}>{c.issuedDate}</span>
            <span data-testid={`cert-hours-${c.id}`}>{c.hoursCompleted}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
