'use client'
import { useApp } from '../components/AppStateProvider'
import type { Activity, Contact } from '../lib/types'

export function activitiesForContact(_activities: Activity[], _contactId: string): Activity[] {
  // TODO: filter activities by contactId
  return []
}

export function contactsForCompany(_contacts: Contact[], _companyId: string): Contact[] {
  // TODO: filter contacts by companyId
  return []
}

export function allTags(_contacts: Contact[]): string[] {
  // TODO: sorted unique list of every tag across contacts
  return []
}

export function useContacts() {
  const { contacts, activities } = useApp()
  return {
    tags: allTags(contacts),
    activityCount: activities.length,
  }
}
