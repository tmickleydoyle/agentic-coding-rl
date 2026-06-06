'use client'
import React from 'react'
export function ContactsPage() {
  return (
    <div>
      <h1>Contacts</h1>
      <form data-testid="add-contact-form">
        <input data-testid="input-contact-name" placeholder="Name" />
        <input data-testid="input-contact-email" placeholder="Email" />
        <input data-testid="input-contact-phone" placeholder="Phone" />
        <select data-testid="select-contact-supplier"><option value="">Select supplier</option></select>
        <input data-testid="input-contact-role" placeholder="Role" />
        <button data-testid="btn-add-contact" type="submit">Add Contact</button>
      </form>
      <ul data-testid="contact-list"></ul>
    </div>
  )
}
