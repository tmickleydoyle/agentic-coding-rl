'use client';
import React from 'react';
export function ContactsPage() {
  return <div><h1>Contacts</h1>
    <input data-testid="contact-name" /><input data-testid="contact-email" /><input data-testid="contact-phone" />
    <select data-testid="contact-group"></select>
    <button data-testid="add-contact-btn">Add</button>
    <table><tbody></tbody></table>
  </div>;
}
