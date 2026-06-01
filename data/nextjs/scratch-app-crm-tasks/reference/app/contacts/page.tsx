'use client'
import { useApp } from '../../components/AppStateProvider'

export default function ContactsPage() {
  const { contacts, followups } = useApp()
  return (
    <section data-testid="page-contacts">
      <h1>Contacts</h1>
      <ul data-testid="contact-list">
        {contacts.map((c) => {
          const mine = followups.filter((f) => f.contactId === c.id)
          const open = mine.filter((f) => !f.done).length
          return (
            <li key={c.id} data-testid={`contact-${c.id}`}>
              <span data-testid={`contact-${c.id}-name`}>{c.name}</span>
              <span data-testid={`contact-${c.id}-open`}>{open}</span>
              <span data-testid={`contact-${c.id}-total`}>{mine.length}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
