export type Contact = {
  id: string
  name: string
  companyId: string
  tags: string[]
}

export type Company = {
  id: string
  name: string
}

export type Activity = {
  id: string
  contactId: string
  kind: 'call' | 'email' | 'note'
  text: string
}

export type ActivityKind = Activity['kind']

export type Route = 'contacts' | 'contact-detail' | 'companies' | 'activity'
export type Theme = 'light' | 'dark'
