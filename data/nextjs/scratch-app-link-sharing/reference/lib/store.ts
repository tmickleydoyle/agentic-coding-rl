import { Link, Comment } from './types';

let links: Link[] = [
  {
    id: 'l1', title: 'OpenAI launches GPT-5', url: 'https://openai.com', submitter: 'alice', category: 'Tech',
    upvotes: 20, comments: [{ id: 'c1', author: 'bob', body: 'Impressive!', createdAt: '2024-01-01T10:00:00Z' }],
    createdAt: '2024-01-01T09:00:00Z',
  },
  {
    id: 'l2', title: 'Funny cat video', url: 'https://cats.example.com', submitter: 'bob', category: 'Fun',
    upvotes: 8, comments: [], createdAt: '2024-01-02T09:00:00Z',
  },
  {
    id: 'l3', title: 'Breaking news', url: 'https://news.example.com', submitter: 'carol', category: 'News',
    upvotes: 15, comments: [
      { id: 'c2', author: 'alice', body: 'Big story!', createdAt: '2024-01-03T10:00:00Z' },
      { id: 'c3', author: 'carol', body: 'Indeed.', createdAt: '2024-01-03T11:00:00Z' },
    ], createdAt: '2024-01-03T09:00:00Z',
  },
];

let nextLinkNum = 4;
let nextCommentNum = 4;

export function getLinks(): Link[] {
  return [...links].sort((a, b) => b.upvotes - a.upvotes);
}

export function getLink(id: string): Link | undefined {
  return links.find((l) => l.id === id);
}

export function createLink(data: { title: string; url: string; submitter: string; category: string }): Link {
  const link: Link = {
    id: `l${nextLinkNum++}`, title: data.title, url: data.url, submitter: data.submitter,
    category: data.category as Link['category'], upvotes: 0, comments: [], createdAt: new Date().toISOString(),
  };
  links.push(link);
  return link;
}

export function upvoteLink(id: string): number | null {
  const link = links.find((l) => l.id === id);
  if (!link) return null;
  link.upvotes += 1;
  return link.upvotes;
}

export function addComment(linkId: string, data: { author: string; body: string }): Comment | null {
  const link = links.find((l) => l.id === linkId);
  if (!link) return null;
  const comment: Comment = { id: `c${nextCommentNum++}`, author: data.author, body: data.body, createdAt: new Date().toISOString() };
  link.comments.push(comment);
  return comment;
}

export function __reset() {
  links = [
    {
      id: 'l1', title: 'OpenAI launches GPT-5', url: 'https://openai.com', submitter: 'alice', category: 'Tech',
      upvotes: 20, comments: [{ id: 'c1', author: 'bob', body: 'Impressive!', createdAt: '2024-01-01T10:00:00Z' }],
      createdAt: '2024-01-01T09:00:00Z',
    },
    {
      id: 'l2', title: 'Funny cat video', url: 'https://cats.example.com', submitter: 'bob', category: 'Fun',
      upvotes: 8, comments: [], createdAt: '2024-01-02T09:00:00Z',
    },
    {
      id: 'l3', title: 'Breaking news', url: 'https://news.example.com', submitter: 'carol', category: 'News',
      upvotes: 15, comments: [
        { id: 'c2', author: 'alice', body: 'Big story!', createdAt: '2024-01-03T10:00:00Z' },
        { id: 'c3', author: 'carol', body: 'Indeed.', createdAt: '2024-01-03T11:00:00Z' },
      ], createdAt: '2024-01-03T09:00:00Z',
    },
  ];
  nextLinkNum = 4;
  nextCommentNum = 4;
}
