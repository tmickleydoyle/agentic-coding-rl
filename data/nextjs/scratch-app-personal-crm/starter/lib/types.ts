export interface Note {
  id: string;
  contactId: string;
  content: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  tags: string[];
  notes: Note[];
  createdAt: string;
}

export type Route = "dashboard" | "contacts" | "notes" | "tags";
