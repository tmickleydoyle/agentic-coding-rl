import { Article, Revision } from './types';

let articles: Article[] = [
  {
    id: 'a1', title: 'Getting Started', body: 'Welcome to the wiki.', author: 'alice', tags: ['guide'],
    revisions: [{ id: 'rev1', body: 'Welcome to the wiki.', editedBy: 'alice', editedAt: '2024-01-01T09:00:00Z' }],
    createdAt: '2024-01-01T09:00:00Z', updatedAt: '2024-01-01T09:00:00Z',
  },
  {
    id: 'a2', title: 'TypeScript Guide', body: 'TypeScript adds types to JS.', author: 'bob', tags: ['tech', 'guide'],
    revisions: [{ id: 'rev2', body: 'TypeScript adds types to JS.', editedBy: 'bob', editedAt: '2024-01-02T09:00:00Z' }],
    createdAt: '2024-01-02T09:00:00Z', updatedAt: '2024-01-02T09:00:00Z',
  },
  {
    id: 'a3', title: 'Markdown Tips', body: 'Use # for headings.', author: 'carol', tags: ['tips'],
    revisions: [{ id: 'rev3', body: 'Use # for headings.', editedBy: 'carol', editedAt: '2024-01-03T09:00:00Z' }],
    createdAt: '2024-01-03T09:00:00Z', updatedAt: '2024-01-03T09:00:00Z',
  },
];

let nextArticleNum = 4;
let nextRevNum = 4;

export function getArticles(): Article[] {
  return [...articles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getArticle(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}

export function createArticle(data: { title: string; body: string; author: string; tags: string[] }): Article {
  const now = new Date().toISOString();
  const article: Article = {
    id: `a${nextArticleNum++}`,
    title: data.title,
    body: data.body,
    author: data.author,
    tags: data.tags,
    revisions: [{ id: `rev${nextRevNum++}`, body: data.body, editedBy: data.author, editedAt: now }],
    createdAt: now,
    updatedAt: now,
  };
  articles.push(article);
  return article;
}

export function editArticle(id: string, data: { body: string; editedBy: string }): Article | null {
  const article = articles.find((a) => a.id === id);
  if (!article) return null;
  const now = new Date().toISOString();
  article.body = data.body;
  article.updatedAt = now;
  article.revisions.push({ id: `rev${nextRevNum++}`, body: data.body, editedBy: data.editedBy, editedAt: now });
  return article;
}

export function __reset() {
  articles = [
    {
      id: 'a1', title: 'Getting Started', body: 'Welcome to the wiki.', author: 'alice', tags: ['guide'],
      revisions: [{ id: 'rev1', body: 'Welcome to the wiki.', editedBy: 'alice', editedAt: '2024-01-01T09:00:00Z' }],
      createdAt: '2024-01-01T09:00:00Z', updatedAt: '2024-01-01T09:00:00Z',
    },
    {
      id: 'a2', title: 'TypeScript Guide', body: 'TypeScript adds types to JS.', author: 'bob', tags: ['tech', 'guide'],
      revisions: [{ id: 'rev2', body: 'TypeScript adds types to JS.', editedBy: 'bob', editedAt: '2024-01-02T09:00:00Z' }],
      createdAt: '2024-01-02T09:00:00Z', updatedAt: '2024-01-02T09:00:00Z',
    },
    {
      id: 'a3', title: 'Markdown Tips', body: 'Use # for headings.', author: 'carol', tags: ['tips'],
      revisions: [{ id: 'rev3', body: 'Use # for headings.', editedBy: 'carol', editedAt: '2024-01-03T09:00:00Z' }],
      createdAt: '2024-01-03T09:00:00Z', updatedAt: '2024-01-03T09:00:00Z',
    },
  ];
  nextArticleNum = 4;
  nextRevNum = 4;
}
