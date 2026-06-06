'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function BookingPage() {
  const { tutors, sessions, setSessions, selectedTutorId } = useApp();
  const [tutorId, setTutorId] = useState(selectedTutorId ? String(selectedTutorId) : '');
  const [studentName, setStudentName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [success, setSuccess] = useState(false);

  async function handleBook() {
    if (!tutorId || !studentName || !date || !time) return;
    const res = await fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tutorId: Number(tutorId), studentName, date, time, duration: Number(duration) }) });
    if (res.ok) {
      const session = await res.json();
      setSessions([...sessions, session]);
      setStudentName(''); setDate(''); setTime(''); setDuration('60'); setSuccess(true);
    }
  }

  return (
    <div data-testid="booking-page">
      <h2>Book Session</h2>
      {success && <p data-testid="booking-success">Session booked!</p>}
      <div data-testid="booking-form">
        <select data-testid="booking-tutor-select" value={tutorId} onChange={(e) => setTutorId(e.target.value)}>
          <option value="">Select tutor</option>
          {tutors.filter((t) => t.available).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <input data-testid="booking-student-input" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Your name" />
        <input data-testid="booking-date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input data-testid="booking-time-input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <select data-testid="booking-duration-select" value={duration} onChange={(e) => setDuration(e.target.value)}>
          <option value="30">30 min</option>
          <option value="45">45 min</option>
          <option value="60">60 min</option>
          <option value="90">90 min</option>
        </select>
        <button data-testid="booking-submit-btn" onClick={handleBook}>Book Session</button>
      </div>
    </div>
  );
}
