export interface Message {
  id: string;
  author: string;
  body: string;
  sentAt: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  members: string[];
  messages: Message[];
}

export type Route = 'home' | 'rooms' | 'room' | 'profile';

export interface AppState {
  route: Route;
  selectedRoomId: string | null;
  selectedUser: string | null;
}
