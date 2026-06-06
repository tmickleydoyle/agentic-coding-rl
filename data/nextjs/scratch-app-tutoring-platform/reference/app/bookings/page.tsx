import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { addBooking, updateBookingStatus } from "../../lib/store";
import type { Subject, BookingStatus } from "../../lib/types";

const SUBJECTS: Subject[] = ["Math", "Science", "English", "History", "Computer Science", "Music", "Art"];

export default function BookingsPage() {
  const { bookings, setBookings, tutors } = useApp();
  const [tutorId, setTutorId] = useState("");
  const [subject, setSubject] = useState<Subject>("Math");
  const [studentName, setStudentName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("1");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!tutorId || !studentName.trim() || !date || !startTime) { setError("All fields required"); return; }
    const hrs = parseFloat(duration);
    if (isNaN(hrs) || hrs <= 0) { setError("Duration must be positive"); return; }
    const tutor = tutors.find(t => t.id === tutorId);
    if (!tutor) { setError("Tutor not found"); return; }
    const b = addBooking({ tutorId, tutorName: tutor.name, subject, studentName: studentName.trim(), date, startTime, durationHours: hrs, status: "pending", notes });
    setBookings([...bookings, b]);
    setTutorId(""); setStudentName(""); setDate(""); setStartTime(""); setNotes(""); setError("");
  }

  function handleStatus(id: string, status: BookingStatus) {
    const updated = updateBookingStatus(id, status);
    if (updated) setBookings(bookings.map(b => b.id === id ? updated : b));
  }

  const totalCost = bookings
    .filter(b => b.status !== "cancelled")
    .reduce((sum, b) => {
      const tutor = tutors.find(t => t.id === b.tutorId);
      return sum + (tutor ? tutor.hourlyRate * b.durationHours : 0);
    }, 0);

  return (
    <div data-testid="bookings-page">
      <h2>Bookings</h2>
      <div data-testid="total-cost">${totalCost} total</div>
      {error && <div data-testid="booking-error">{error}</div>}
      <ul data-testid="booking-list">
        {bookings.map(b => (
          <li key={b.id} data-testid={`booking-item-${b.id}`}>
            <span data-testid={`booking-tutor-${b.id}`}>{b.tutorName}</span>
            <span data-testid={`booking-student-${b.id}`}>{b.studentName}</span>
            <span data-testid={`booking-subject-${b.id}`}>{b.subject}</span>
            <span data-testid={`booking-status-${b.id}`}>{b.status}</span>
            <button data-testid={`btn-confirm-${b.id}`} onClick={() => handleStatus(b.id, "confirmed")}>Confirm</button>
            <button data-testid={`btn-cancel-${b.id}`} onClick={() => handleStatus(b.id, "cancelled")}>Cancel</button>
          </li>
        ))}
      </ul>
      <div data-testid="add-booking-form">
        <select data-testid="select-tutor" value={tutorId} onChange={e => setTutorId(e.target.value)}>
          <option value="">Select tutor</option>
          {tutors.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select data-testid="select-subject" value={subject} onChange={e => setSubject(e.target.value as Subject)}>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input data-testid="input-student" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Student name" />
        <input data-testid="input-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input data-testid="input-time" value={startTime} onChange={e => setStartTime(e.target.value)} placeholder="Start time (HH:MM)" />
        <input data-testid="input-duration" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (hours)" />
        <input data-testid="input-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
        <button data-testid="btn-add-booking" onClick={handleAdd}>Book Session</button>
      </div>
    </div>
  );
}
