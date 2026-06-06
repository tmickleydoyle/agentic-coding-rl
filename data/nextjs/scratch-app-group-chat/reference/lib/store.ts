import { Room, Message } from './types';

let rooms: Room[] = [
  {
    id: 'room1', name: 'General', description: 'General chat', members: ['alice', 'bob', 'carol'],
    messages: [
      { id: 'm1', author: 'alice', body: 'Hello everyone!', sentAt: '2024-01-01T10:00:00Z' },
      { id: 'm2', author: 'bob', body: 'Hi Alice!', sentAt: '2024-01-01T10:01:00Z' },
    ],
  },
  {
    id: 'room2', name: 'Tech Talk', description: 'Tech discussions', members: ['alice', 'bob'],
    messages: [{ id: 'm3', author: 'bob', body: 'Anyone know TypeScript?', sentAt: '2024-01-02T10:00:00Z' }],
  },
  {
    id: 'room3', name: 'Off-Topic', description: 'Random stuff', members: ['carol'],
    messages: [],
  },
];

let nextMsgNum = 4;

export function getRooms(): Room[] { return rooms; }

export function getRoom(id: string): Room | undefined { return rooms.find((r) => r.id === id); }

export function sendMessage(roomId: string, data: { author: string; body: string }): Message | null {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return null;
  const msg: Message = { id: `m${nextMsgNum++}`, author: data.author, body: data.body, sentAt: new Date().toISOString() };
  room.messages.push(msg);
  return msg;
}

export function joinRoom(roomId: string, username: string): string[] | null {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return null;
  if (!room.members.includes(username)) room.members.push(username);
  return room.members;
}

export function __reset() {
  rooms = [
    {
      id: 'room1', name: 'General', description: 'General chat', members: ['alice', 'bob', 'carol'],
      messages: [
        { id: 'm1', author: 'alice', body: 'Hello everyone!', sentAt: '2024-01-01T10:00:00Z' },
        { id: 'm2', author: 'bob', body: 'Hi Alice!', sentAt: '2024-01-01T10:01:00Z' },
      ],
    },
    {
      id: 'room2', name: 'Tech Talk', description: 'Tech discussions', members: ['alice', 'bob'],
      messages: [{ id: 'm3', author: 'bob', body: 'Anyone know TypeScript?', sentAt: '2024-01-02T10:00:00Z' }],
    },
    {
      id: 'room3', name: 'Off-Topic', description: 'Random stuff', members: ['carol'],
      messages: [],
    },
  ];
  nextMsgNum = 4;
}
