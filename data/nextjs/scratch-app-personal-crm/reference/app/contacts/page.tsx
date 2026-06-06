import React, { useState } from "react";
import { getContacts, deleteContact } from "../../lib/store";

export function ContactsPage() {
  const [search, setSearch] = useState("");
  const [, forceUpdate] = useState(0);

  const contacts = getContacts();
  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteContact(id);
    forceUpdate((n) => n + 1);
  };

  return (
    <div data-testid="contacts-page">
      <h2>Contacts</h2>
      <input
        data-testid="search-input"
        placeholder="Search by name or company"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filtered.length === 0 && <div data-testid="no-results">No results found</div>}
      {filtered.map((c) => (
        <div key={c.id} data-testid="contact-row">
          <span data-testid="contact-name">{c.name}</span>
          <span data-testid="contact-company">{c.company}</span>
          <span data-testid="contact-email">{c.email}</span>
          <span data-testid="contact-tags">{c.tags.join(", ")}</span>
          <button data-testid="delete-contact" onClick={() => handleDelete(c.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
