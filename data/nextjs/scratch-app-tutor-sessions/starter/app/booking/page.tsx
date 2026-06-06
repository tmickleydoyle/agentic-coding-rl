'use client'
import React from 'react';
export function BookingPage() {
  return (
    <div data-testid="booking-page">
      <h2>Book Session</h2>
      <div data-testid="booking-form">
        <select data-testid="booking-tutor-select"><option value="">Select tutor</option></select>
        <input data-testid="booking-student-input" placeholder="Your name" />
        <input data-testid="booking-date-input" type="date" />
        <input data-testid="booking-time-input" type="time" />
        <select data-testid="booking-duration-select"><option value="60">60 min</option></select>
        <button data-testid="booking-submit-btn">Book Session</button>
      </div>
    </div>
  );
}
