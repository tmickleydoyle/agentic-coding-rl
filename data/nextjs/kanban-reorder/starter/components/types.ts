export type Card = { id: string; title: string }
export type Column = { id: string; title: string }
export type Board = {
  columns: Column[]
  cards: Record<string, Card[]>
}
