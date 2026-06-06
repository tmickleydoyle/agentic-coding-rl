import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { ContactRole } from "../../lib/types";

export function ContactsPage() {
  const { contacts, addContact, deleteContact } = useApp();
  const [name, setName] = useState("");
  const [role, setRole] = useState<ContactRole>("Other");
  const [phone, setPhone] = useState("");

  const handleAdd = () => {
    if (!name) return;
    addContact({ name, role, phone });
    setName(""); setPhone("");
  };

  return (
    <div data-testid="contacts-page">
      <h1>Contacts</h1>
      {contacts.length === 0 ? (
        <p data-testid="no-contacts">No contacts found.</p>
      ) : (
        <ul data-testid="contact-list">
          {contacts.map((c) => (
            <li key={c.id} data-testid={`contact-item-${c.id}`}>
              <span data-testid={`contact-name-${c.id}`}>{c.name}</span>
              <span data-testid={`contact-role-${c.id}`}>{c.role}</span>
              <span data-testid={`contact-phone-${c.id}`}>{c.phone}</span>
              <button data-testid={`delete-contact-${c.id}`} onClick={() => deleteContact(c.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <div data-testid="add-contact-form">
        <input data-testid="contact-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <select data-testid="contact-role-select" value={role} onChange={(e) => setRole(e.target.value as ContactRole)}>
          <option>Solicitor</option>
          <option>Accountant</option>
          <option>Bank</option>
          <option>Other</option>
        </select>
        <input data-testid="contact-phone-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
        <button data-testid="add-contact-btn" onClick={handleAdd}>Add Contact</button>
      </div>
    </div>
  );
}
