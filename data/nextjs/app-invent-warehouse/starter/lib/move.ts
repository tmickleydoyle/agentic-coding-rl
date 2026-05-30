import type { Bin } from './types'

export type MoveResult = { ok: true; bins: Bin[] } | { ok: false; error: string }

// Pure transfer of `qty` units of `name` from bin `fromId` to bin `toId`.
// TODO: validate (same bin, positive qty, bins exist, enough stock, enough space) and on
// success return a new bins array with the source decremented (item removed at 0) and the
// destination incremented (item appended if absent).
export function moveItem(
  _bins: Bin[],
  _fromId: string,
  _toId: string,
  _name: string,
  _qty: number,
): MoveResult {
  return { ok: false, error: 'not implemented' }
}
