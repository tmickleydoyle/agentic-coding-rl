import type { Feedback, FeedbackStatus, Sentiment } from './types'

// In-memory server store for the API routes. SEPARATE from the client state.
// Tests call __reset() in beforeEach for isolation.

let items: Feedback[] = []
let nextId = 1

const STATUSES: FeedbackStatus[] = ['new', 'reviewed', 'resolved']
const SENTIMENTS: Sentiment[] = ['positive', 'neutral', 'negative']

function seed(): void {
  items = [
    { id: 'f1', author: 'Sam', message: 'Love the new dashboard', category: 'UI', sentiment: 'positive', status: 'new' },
    { id: 'f2', author: 'Rae', message: 'Export keeps failing', category: 'Bug', sentiment: 'negative', status: 'new' },
    { id: 'f3', author: 'Lou', message: 'Please add dark mode', category: 'Feature', sentiment: 'neutral', status: 'reviewed' },
    { id: 'f4', author: 'Kit', message: 'Search is much faster', category: 'UI', sentiment: 'positive', status: 'resolved' },
  ]
  nextId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listFeedback(filter?: { category?: string | null; status?: string | null }): Feedback[] {
  let out = items.slice()
  const category = filter?.category
  if (category) out = out.filter((f) => f.category === category)
  const status = filter?.status
  if (status) out = out.filter((f) => f.status === status)
  return out
}

export function findFeedback(id: string): Feedback | undefined {
  return items.find((f) => f.id === id)
}

export function createFeedback(input: {
  author: string
  message: string
  category?: string
  sentiment?: Sentiment
}): Feedback {
  const item: Feedback = {
    id: `f${nextId++}`,
    author: input.author,
    message: input.message,
    category: input.category ?? 'General',
    sentiment: input.sentiment ?? 'neutral',
    status: 'new',
  }
  items.push(item)
  return item
}

export function setStatus(id: string, status: FeedbackStatus): Feedback | undefined {
  const item = items.find((f) => f.id === id)
  if (!item) return undefined
  if (STATUSES.indexOf(status) === -1) return undefined
  item.status = status
  return item
}

export function isSentiment(value: unknown): value is Sentiment {
  return typeof value === 'string' && SENTIMENTS.indexOf(value as Sentiment) !== -1
}

export function isStatus(value: unknown): value is FeedbackStatus {
  return typeof value === 'string' && STATUSES.indexOf(value as FeedbackStatus) !== -1
}
