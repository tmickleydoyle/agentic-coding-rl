export type Card = { id: number; title: string }
export type ColumnIndex = 0 | 1 | 2
export const COLUMN_NAMES = ['To Do', 'Doing', 'Done'] as const
