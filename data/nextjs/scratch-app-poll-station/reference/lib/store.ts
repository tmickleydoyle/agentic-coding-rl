import { Poll } from './types';

let polls: Poll[] = [
  { id: 'p1', question: 'Favorite color?', creator: 'alice', status: 'open',
    options: [{ id: 'o1', text: 'Red', votes: 5 }, { id: 'o2', text: 'Blue', votes: 3 }, { id: 'o3', text: 'Green', votes: 2 }],
    createdAt: '2024-01-01T09:00:00Z' },
  { id: 'p2', question: 'Best JS framework?', creator: 'bob', status: 'open',
    options: [{ id: 'o4', text: 'React', votes: 10 }, { id: 'o5', text: 'Vue', votes: 4 }, { id: 'o6', text: 'Angular', votes: 2 }],
    createdAt: '2024-01-02T09:00:00Z' },
  { id: 'p3', question: 'Morning or night?', creator: 'carol', status: 'closed',
    options: [{ id: 'o7', text: 'Morning', votes: 7 }, { id: 'o8', text: 'Night', votes: 7 }],
    createdAt: '2024-01-03T09:00:00Z' },
];

let nextPollNum = 4;
let nextOptNum = 9;

export function getPolls(): Poll[] {
  return [...polls].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getPoll(id: string): Poll | undefined {
  return polls.find((p) => p.id === id);
}

export function createPoll(data: { question: string; creator: string; options: string[] }): Poll {
  const poll: Poll = {
    id: `p${nextPollNum++}`, question: data.question, creator: data.creator, status: 'open',
    options: data.options.map((text) => ({ id: `o${nextOptNum++}`, text, votes: 0 })),
    createdAt: new Date().toISOString(),
  };
  polls.push(poll);
  return poll;
}

export function vote(pollId: string, optionId: string): { poll?: Poll; error?: string; status?: number } {
  const poll = polls.find((p) => p.id === pollId);
  if (!poll) return { error: 'not found', status: 404 };
  if (poll.status === 'closed') return { error: 'Poll is closed', status: 400 };
  const option = poll.options.find((o) => o.id === optionId);
  if (!option) return { error: 'not found', status: 404 };
  option.votes += 1;
  return { poll };
}

export function closePoll(pollId: string): Poll | null {
  const poll = polls.find((p) => p.id === pollId);
  if (!poll) return null;
  poll.status = 'closed';
  return poll;
}

export function __reset() {
  polls = [
    { id: 'p1', question: 'Favorite color?', creator: 'alice', status: 'open',
      options: [{ id: 'o1', text: 'Red', votes: 5 }, { id: 'o2', text: 'Blue', votes: 3 }, { id: 'o3', text: 'Green', votes: 2 }],
      createdAt: '2024-01-01T09:00:00Z' },
    { id: 'p2', question: 'Best JS framework?', creator: 'bob', status: 'open',
      options: [{ id: 'o4', text: 'React', votes: 10 }, { id: 'o5', text: 'Vue', votes: 4 }, { id: 'o6', text: 'Angular', votes: 2 }],
      createdAt: '2024-01-02T09:00:00Z' },
    { id: 'p3', question: 'Morning or night?', creator: 'carol', status: 'closed',
      options: [{ id: 'o7', text: 'Morning', votes: 7 }, { id: 'o8', text: 'Night', votes: 7 }],
      createdAt: '2024-01-03T09:00:00Z' },
  ];
  nextPollNum = 4;
  nextOptNum = 9;
}
