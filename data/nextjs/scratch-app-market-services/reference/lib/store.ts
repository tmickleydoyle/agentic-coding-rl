import type { Category, Gig } from './types'

// In-memory server store for the API routes. SEPARATE from the client state.

let gigs: Gig[] = []
let nextGigId = 1
let nextReviewId = 1

function seed(): void {
  gigs = [
    {
      id: 'g1',
      title: 'Logo design',
      category: 'design',
      price: 80,
      reviews: [
        { id: 'r1', author: 'sam', rating: 5, text: 'Great!' },
        { id: 'r2', author: 'mia', rating: 4, text: 'Solid' },
      ],
    },
    { id: 'g2', title: 'Blog post', category: 'writing', price: 50, reviews: [] },
    {
      id: 'g3',
      title: 'Bug fix',
      category: 'dev',
      price: 120,
      reviews: [{ id: 'r3', author: 'lee', rating: 3, text: 'Ok' }],
    },
  ]
  nextGigId = 4
  nextReviewId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listGigs(filter?: { category?: string | null }): Gig[] {
  let out = gigs.slice()
  const category = filter?.category
  if (category) out = out.filter((g) => g.category === category)
  return out
}

export function findGig(id: string): Gig | undefined {
  return gigs.find((g) => g.id === id)
}

export function createGig(input: { title: string; category?: Category; price?: number }): Gig {
  const gig: Gig = {
    id: `g${nextGigId++}`,
    title: input.title,
    category: input.category ?? 'dev',
    price: input.price ?? 0,
    reviews: [],
  }
  gigs.push(gig)
  return gig
}

export function addReview(
  gigId: string,
  input: { author: string; rating: number; text?: string },
): Gig | undefined {
  const gig = gigs.find((g) => g.id === gigId)
  if (!gig) return undefined
  gig.reviews.push({
    id: `r${nextReviewId++}`,
    author: input.author,
    rating: input.rating,
    text: input.text ?? '',
  })
  return gig
}
