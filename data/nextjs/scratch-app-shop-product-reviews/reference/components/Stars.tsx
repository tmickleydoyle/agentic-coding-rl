'use client'

export default function Stars({ rating }: { rating: number }) {
  return <span data-testid="stars">{rating}</span>
}
