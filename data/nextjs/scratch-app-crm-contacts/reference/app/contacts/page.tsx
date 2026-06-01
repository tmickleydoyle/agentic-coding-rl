'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { allTags } from '../../hooks/useContacts'
import ContactRow from '../../components/ContactRow'

export default function ContactsPage() {
  const { contacts, companies, selectContact } = useApp()
  const [tagFilter, setTagFilter] = useState<string>('all')

  const companyName = (id: string): string =>
    companies.find((c) => c.id === id)?.name ?? 'Unknown'

  const visible =
    tagFilter === 'all' ? contacts : contacts.filter((c) => c.tags.includes(tagFilter))

  return (
    <section data-testid="page-contacts">
      <h1>Contacts</h1>
      <select
        data-testid="tag-filter"
        value={tagFilter}
        onChange={(e) => setTagFilter(e.target.value)}
      >
        <option value="all">All tags</option>
        {allTags(contacts).map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      {visible.length === 0 ? (
        <p data-testid="empty-state">No contacts.</p>
      ) : (
        <ul data-testid="contact-list">
          {visible.map((c) => (
            <ContactRow
              key={c.id}
              contact={c}
              companyName={companyName(c.companyId)}
              onOpen={selectContact}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
