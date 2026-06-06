'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function TutorsPage() {
  const { tutors, navigate, setSelectedTutorId } = useApp();

  function handleBook(id: number) {
    setSelectedTutorId(id);
    navigate('booking');
  }

  return (
    <div data-testid="tutors-page">
      <h2>Tutors</h2>
      <ul data-testid="tutor-list">
        {tutors.map((t) => (
          <li key={t.id} data-testid={`tutor-${t.id}`}>
            <span data-testid={`tutor-name-${t.id}`}>{t.name}</span>
            <span data-testid={`tutor-subject-${t.id}`}>{t.subject}</span>
            <span data-testid={`tutor-rating-${t.id}`}>★ {t.rating.toFixed(1)}</span>
            <span data-testid={`tutor-availability-${t.id}`}>{t.available ? 'Available' : 'Unavailable'}</span>
            {t.available && <button data-testid={`book-tutor-${t.id}`} onClick={() => handleBook(t.id)}>Book Session</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
