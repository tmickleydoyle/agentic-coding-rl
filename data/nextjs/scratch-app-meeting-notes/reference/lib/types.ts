export interface AgendaItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  attendees: string;
  agenda: AgendaItem[];
  notes: string;
  actionItems: string;
  createdAt: string;
}

export type Route = "meetings" | "agenda" | "search";
