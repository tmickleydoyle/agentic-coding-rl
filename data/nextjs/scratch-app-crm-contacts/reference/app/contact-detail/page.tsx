'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { activitiesForContact } from '../../hooks/useContacts'

export default function ContactDetailPage() {
  const { contacts, companies, activities, selectedContactId, addTag, removeTag } = useApp()
  const [tagInput, setTagInput] = useState('')
  const contact = contacts.find((c) => c.id === selectedContactId)

  if (!contact) {
    return (
      <section data-testid="page-contact-detail">
        <p data-testid="no-contact">No contact selected.</p>
      </section>
    )
  }

  const company = companies.find((c) => c.id === contact.companyId)
  const log = activitiesForContact(activities, contact.id)

  return (
    <section data-testid="page-contact-detail">
      <h1 data-testid="detail-name">{contact.name}</h1>
      <p data-testid="detail-company">{company ? company.name : 'Unknown'}</p>
      <ul data-testid="detail-tags">
        {contact.tags.map((t) => (
          <li key={t} data-testid={`tag-${t}`}>
            <span>{t}</span>
            <button data-testid={`remove-tag-${t}`} onClick={() => removeTag(contact.id, t)}>
              x
            </button>
          </li>
        ))}
      </ul>
      <input
        data-testid="tag-input"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
      />
      <button
        data-testid="add-tag"
        onClick={() => {
          addTag(contact.id, tagInput)
          setTagInput('')
        }}
      >
        Add tag
      </button>
      <ul data-testid="detail-activities">
        {log.map((a) => (
          <li key={a.id} data-testid={`activity-${a.id}`} data-kind={a.kind}>
            <span data-testid={`activity-${a.id}-text`}>{a.text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
