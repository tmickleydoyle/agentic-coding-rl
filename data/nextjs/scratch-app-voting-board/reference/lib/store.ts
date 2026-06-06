import { Proposal } from './types';

let proposals: Proposal[] = [
  { id: 'pr1', title: 'Add dark mode', description: 'Support dark theme', author: 'alice', category: 'Feature', upvotes: 15, downvotes: 2, status: 'open', createdAt: '2024-01-01T09:00:00Z' },
  { id: 'pr2', title: 'Fix login bug', description: 'Login fails on mobile', author: 'bob', category: 'Bug Fix', upvotes: 20, downvotes: 1, status: 'open', createdAt: '2024-01-02T09:00:00Z' },
  { id: 'pr3', title: 'Improve performance', description: 'Reduce load time', author: 'carol', category: 'Improvement', upvotes: 8, downvotes: 5, status: 'closed', createdAt: '2024-01-03T09:00:00Z' },
  { id: 'pr4', title: 'Add notifications', description: 'Push notifications', author: 'alice', category: 'Feature', upvotes: 12, downvotes: 3, status: 'open', createdAt: '2024-01-04T09:00:00Z' },
];

let nextNum = 5;

function score(p: Proposal) { return p.upvotes - p.downvotes; }

export function getProposals(): Proposal[] {
  return [...proposals].sort((a, b) => score(b) - score(a));
}

export function getProposal(id: string): Proposal | undefined {
  return proposals.find((p) => p.id === id);
}

export function createProposal(data: { title: string; description: string; author: string; category: string }): Proposal {
  const p: Proposal = {
    id: `pr${nextNum++}`, title: data.title, description: data.description, author: data.author,
    category: data.category as Proposal['category'], upvotes: 0, downvotes: 0, status: 'open',
    createdAt: new Date().toISOString(),
  };
  proposals.push(p);
  return p;
}

export function upvote(id: string): { upvotes?: number; score?: number; error?: string; status?: number } {
  const p = proposals.find((pr) => pr.id === id);
  if (!p) return { error: 'not found', status: 404 };
  if (p.status === 'closed') return { error: 'Proposal is closed', status: 400 };
  p.upvotes += 1;
  return { upvotes: p.upvotes, score: score(p) };
}

export function downvote(id: string): { downvotes?: number; score?: number; error?: string; status?: number } {
  const p = proposals.find((pr) => pr.id === id);
  if (!p) return { error: 'not found', status: 404 };
  if (p.status === 'closed') return { error: 'Proposal is closed', status: 400 };
  p.downvotes += 1;
  return { downvotes: p.downvotes, score: score(p) };
}

export function __reset() {
  proposals = [
    { id: 'pr1', title: 'Add dark mode', description: 'Support dark theme', author: 'alice', category: 'Feature', upvotes: 15, downvotes: 2, status: 'open', createdAt: '2024-01-01T09:00:00Z' },
    { id: 'pr2', title: 'Fix login bug', description: 'Login fails on mobile', author: 'bob', category: 'Bug Fix', upvotes: 20, downvotes: 1, status: 'open', createdAt: '2024-01-02T09:00:00Z' },
    { id: 'pr3', title: 'Improve performance', description: 'Reduce load time', author: 'carol', category: 'Improvement', upvotes: 8, downvotes: 5, status: 'closed', createdAt: '2024-01-03T09:00:00Z' },
    { id: 'pr4', title: 'Add notifications', description: 'Push notifications', author: 'alice', category: 'Feature', upvotes: 12, downvotes: 3, status: 'open', createdAt: '2024-01-04T09:00:00Z' },
  ];
  nextNum = 5;
}
