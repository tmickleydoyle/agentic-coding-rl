import type { Article, Category } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let articles: Article[] = []
let nextId = 1

function seed(): void {
  articles = [
    { id: 'a1', title: 'Reset your password', body: 'Use the forgot password link to reset.', category: 'account', helpful: 5, notHelpful: 1 },
    { id: 'a2', title: 'Update payment method', body: 'Go to billing settings to update your card.', category: 'billing', helpful: 3, notHelpful: 0 },
    { id: 'a3', title: 'App is slow to load', body: 'Clear your cache and reload the technical page.', category: 'technical', helpful: 2, notHelpful: 2 },
    { id: 'a4', title: 'Contact support', body: 'Reach our general support team by email.', category: 'general', helpful: 8, notHelpful: 1 },
    { id: 'a5', title: 'Cancel your subscription', body: 'Cancel any time from billing settings.', category: 'billing', helpful: 4, notHelpful: 3 },
  ]
  nextId = 6
}

seed()

export function __reset(): void {
  seed()
}

export function listArticles(filter?: { category?: string | null; q?: string | null }): Article[] {
  let out = articles.slice()
  const category = filter?.category
  if (category === 'account' || category === 'billing' || category === 'technical' || category === 'general') {
    out = out.filter((a) => a.category === category)
  }
  const q = filter?.q
  if (q && q.trim().length > 0) {
    const needle = q.trim().toLowerCase()
    out = out.filter(
      (a) =>
        a.title.toLowerCase().indexOf(needle) !== -1 ||
        a.body.toLowerCase().indexOf(needle) !== -1,
    )
  }
  return out
}

export function createArticle(input: {
  title: string
  body?: string
  category?: Category
}): Article {
  const article: Article = {
    id: `a${nextId++}`,
    title: input.title,
    body: input.body ?? '',
    category: input.category ?? 'general',
    helpful: 0,
    notHelpful: 0,
  }
  articles.push(article)
  return article
}

export function findArticle(id: string): Article | undefined {
  return articles.find((a) => a.id === id)
}

export function updateArticle(
  id: string,
  patch: { vote?: 'helpful' | 'notHelpful'; title?: string; body?: string; category?: Category },
): Article | undefined {
  const article = articles.find((a) => a.id === id)
  if (!article) return undefined
  if (patch.vote === 'helpful') article.helpful += 1
  else if (patch.vote === 'notHelpful') article.notHelpful += 1
  if (typeof patch.title === 'string') article.title = patch.title
  if (typeof patch.body === 'string') article.body = patch.body
  if (patch.category) article.category = patch.category
  return article
}

export function deleteArticle(id: string): boolean {
  const idx = articles.findIndex((a) => a.id === id)
  if (idx === -1) return false
  articles.splice(idx, 1)
  return true
}
