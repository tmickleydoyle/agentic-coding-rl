'use client';
import React from 'react';

export function ContactsPage() {
  return (
    <div>
      <h2>Contacts</h2>
      <form data-testid="contact-add-form">
        <select data-testid="contact-app-select"><option value="">Select application</option></select>
        <input data-testid="contact-name-input" placeholder="Name" />
        <input data-testid="contact-email-input" placeholder="Email" />
        <input data-testid="contact-role-input" placeholder="Role" />
        <button data-testid="contact-submit" type="submit">Add</button>
      </form>
      <ul data-testid="contact-list"></ul>
    </div>
  );
}
