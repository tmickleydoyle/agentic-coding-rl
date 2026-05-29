import type { Person, SortEntry, SortKey } from '../components/types'

// TODO: cycle the clicked key: absent -> append {key, dir:'asc'}; asc -> same slot becomes 'desc';
// desc -> remove it. New keys go to the end; existing keys keep their position.
export function cycleSort(sorts: SortEntry[], key: SortKey): SortEntry[] {
  return sorts
}

// TODO: return a NEW array sorted by the ordered entries (tie-break by next entry); localeCompare
// for strings, numeric for age; desc reverses that entry. Stable. Empty sorts -> input order.
export function sortRows(rows: Person[], sorts: SortEntry[]): Person[] {
  return [...rows]
}
