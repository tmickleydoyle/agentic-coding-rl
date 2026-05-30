'use client'
import { useApp } from '../../components/AppStateProvider'

export default function ContactsPage() {
  const { contacts, deals } = useApp()
  return (
    <section data-testid="page-contacts">
      <h1>Contacts</h1>
      <ul data-testid="contact-list">
        {contacts.map((c) => {
          const count = deals.filter((d) => d.contactId === c.id).length
          return (
            <li key={c.id} data-testid={`contact-${c.id}`}>
              <span data-testid={`contact-${c.id}-name`}>{c.name}</span>
              <span data-testid={`contact-${c.id}-company`}>{c.company}</span>
              <span data-testid={`contact-${c.id}-deals`}>{count}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
