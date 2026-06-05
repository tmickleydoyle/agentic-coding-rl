'use client'
import { useApp } from '../../components/AppStateProvider'
import { contactsForCompany } from '../../hooks/useContacts'

export default function CompaniesPage() {
  const { companies, contacts } = useApp()
  return (
    <section data-testid="page-companies">
      <h1>Companies</h1>
      <ul data-testid="company-list">
        {companies.map((co) => (
          <li key={co.id} data-testid={`company-${co.id}`}>
            <span data-testid={`company-${co.id}-name`}>{co.name}</span>
            <span data-testid={`company-${co.id}-count`}>
              {contactsForCompany(contacts, co.id).length}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
