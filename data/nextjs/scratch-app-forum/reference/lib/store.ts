import { Thread, Reply } from './types';

let threads: Thread[] = [
  {
    id: 't1',
    title: 'Welcome to the Forum',
    body: 'Hello everyone!',
    author: 'alice',
    category: 'General',
    upvotes: 5,
    replies: [{ id: 'r1', author: 'bob', body: 'Hi Alice!', upvotes: 2, createdAt: '2024-01-01T10:00:00Z' }],
    createdAt: '2024-01-01T09:00:00Z',
  },
  {
    id: 't2',
    title: 'Best TypeScript tips',
    body: 'Share your tips here.',
    author: 'bob',
    category: 'Tech',
    upvotes: 12,
    replies: [],
    createdAt: '2024-01-02T09:00:00Z',
  },
  {
    id: 't3',
    title: 'Random thoughts',
    body: 'Just chatting.',
    author: 'carol',
    category: 'Off-Topic',
    upvotes: 1,
    replies: [{ id: 'r2', author: 'alice', body: 'Nice!', upvotes: 0, createdAt: '2024-01-03T11:00:00Z' }],
    createdAt: '2024-01-03T10:00:00Z',
  },
];

let nextThreadNum = 4;
let nextReplyNum = 3;

export function getThreads(): Thread[] {
  return [...threads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getThread(id: string): Thread | undefined {
  return threads.find((t) => t.id === id);
}

export function createThread(data: { title: string; body: string; author: string; category: string }): Thread {
  const thread: Thread = {
    id: `t${nextThreadNum++}`,
    title: data.title,
    body: data.body,
    author: data.author,
    category: data.category as Thread['category'],
    upvotes: 0,
    replies: [],
    createdAt: new Date().toISOString(),
  };
  threads.push(thread);
  return thread;
}

export function addReply(threadId: string, data: { author: string; body: string }): Reply | null {
  const thread = threads.find((t) => t.id === threadId);
  if (!thread) return null;
  const reply: Reply = {
    id: `r${nextReplyNum++}`,
    author: data.author,
    body: data.body,
    upvotes: 0,
    createdAt: new Date().toISOString(),
  };
  thread.replies.push(reply);
  return reply;
}

export function upvoteThread(id: string): number | null {
  const thread = threads.find((t) => t.id === id);
  if (!thread) return null;
  thread.upvotes += 1;
  return thread.upvotes;
}

export function upvoteReply(threadId: string, replyId: string): number | null {
  const thread = threads.find((t) => t.id === threadId);
  if (!thread) return null;
  const reply = thread.replies.find((r) => r.id === replyId);
  if (!reply) return null;
  reply.upvotes += 1;
  return reply.upvotes;
}

export function __reset() {
  threads = [
    {
      id: 't1',
      title: 'Welcome to the Forum',
      body: 'Hello everyone!',
      author: 'alice',
      category: 'General',
      upvotes: 5,
      replies: [{ id: 'r1', author: 'bob', body: 'Hi Alice!', upvotes: 2, createdAt: '2024-01-01T10:00:00Z' }],
      createdAt: '2024-01-01T09:00:00Z',
    },
    {
      id: 't2',
      title: 'Best TypeScript tips',
      body: 'Share your tips here.',
      author: 'bob',
      category: 'Tech',
      upvotes: 12,
      replies: [],
      createdAt: '2024-01-02T09:00:00Z',
    },
    {
      id: 't3',
      title: 'Random thoughts',
      body: 'Just chatting.',
      author: 'carol',
      category: 'Off-Topic',
      upvotes: 1,
      replies: [{ id: 'r2', author: 'alice', body: 'Nice!', upvotes: 0, createdAt: '2024-01-03T11:00:00Z' }],
      createdAt: '2024-01-03T10:00:00Z',
    },
  ];
  nextThreadNum = 4;
  nextReplyNum = 3;
}
