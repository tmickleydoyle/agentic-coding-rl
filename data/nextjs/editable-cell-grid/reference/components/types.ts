export type Coord = { row: number; col: number }

export const sameCoord = (a: Coord | null, b: Coord) =>
  a !== null && a.row === b.row && a.col === b.col
