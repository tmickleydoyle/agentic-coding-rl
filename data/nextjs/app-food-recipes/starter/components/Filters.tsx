'use client'
import type { CuisineFilter } from '../lib/types'

export default function Filters(_props: {
  cuisines: string[]
  cuisineFilter: CuisineFilter
  onCuisineChange: (filter: CuisineFilter) => void
}) {
  // TODO: render a cuisine-filter <select> with an "all" option plus one per cuisine.
  return <div data-testid="filters" />
}
