export type AppStatus = 'applied' | 'interview' | 'offer' | 'rejected';

export interface Application {
  id: string;
  company: string;
  role: string;
  status: AppStatus;
  appliedDate: string;
  url: string;
}

export interface Contact {
  id: string;
  applicationId: string;
  name: string;
  email: string;
  role: string;
}

export interface Note {
  id: string;
  applicationId: string;
  text: string;
  createdAt: string;
}

export type Route = 'home' | 'applications' | 'contacts' | 'notes';
