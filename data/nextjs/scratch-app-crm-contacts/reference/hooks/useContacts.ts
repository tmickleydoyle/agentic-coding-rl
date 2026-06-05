'use client'
import { useApp } from '../components/AppStateProvider'
import type { Activity, Contact } from '../lib/types'

export function activitiesForContact(activities: Activity[], contactId: string): Activity[] {
  return activities.filter((a) => a.contactId === contactId)
}

export function contactsForCompany(contacts: Contact[], companyId: string): Contact[] {
  return contacts.filter((c) => c.companyId === companyId)
}

export function allTags(contacts: Contact[]): string[] {
  const set: Record<string, true> = {}
  contacts.forEach((c) => {
    c.tags.forEach((t) => {
      set[t] = true
    })
  })
  return Object.keys(set).sort()
}

export function useContacts() {
  const { contacts, activities } = useApp()
  return {
    tags: allTags(contacts),
    activityCount: activities.length,
  }
}
