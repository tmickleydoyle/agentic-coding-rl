'use client'
import type { Contact } from '../lib/types'

export default function ContactRow({
  contact,
  companyName,
  onOpen,
}: {
  contact: Contact
  companyName: string
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`contact-${contact.id}`}>
      <span data-testid={`contact-${contact.id}-name`}>{contact.name}</span>
      <span data-testid={`contact-${contact.id}-company`}>{companyName}</span>
      <span data-testid={`contact-${contact.id}-tagcount`}>{contact.tags.length}</span>
      <button data-testid={`open-${contact.id}`} onClick={() => onOpen(contact.id)}>
        Open
      </button>
    </li>
  )
}
