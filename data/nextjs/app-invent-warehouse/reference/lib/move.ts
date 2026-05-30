import type { Bin } from './types'
import { freeSpace } from './types'

export type MoveResult = { ok: true; bins: Bin[] } | { ok: false; error: string }

function cloneBin(bin: Bin): Bin {
  return { ...bin, items: bin.items.map((it) => ({ ...it })) }
}

function itemQty(bin: Bin, name: string): number {
  const found = bin.items.find((it) => it.name === name)
  return found ? found.qty : 0
}

// Pure transfer of `qty` units of `name` from bin `fromId` to bin `toId`. Validates the
// source has enough and the destination has free space. Returns a new bins array on success.
export function moveItem(
  bins: Bin[],
  fromId: string,
  toId: string,
  name: string,
  qty: number,
): MoveResult {
  if (fromId === toId) return { ok: false, error: 'same bin' }
  if (qty <= 0) return { ok: false, error: 'qty must be positive' }
  const from = bins.find((b) => b.id === fromId)
  const to = bins.find((b) => b.id === toId)
  if (!from || !to) return { ok: false, error: 'bin not found' }
  if (itemQty(from, name) < qty) return { ok: false, error: 'not enough stock' }
  if (freeSpace(to) < qty) return { ok: false, error: 'not enough space' }

  const next = bins.map((b) => {
    if (b.id === fromId) {
      const nb = cloneBin(b)
      nb.items = nb.items
        .map((it) => (it.name === name ? { ...it, qty: it.qty - qty } : it))
        .filter((it) => it.qty > 0)
      return nb
    }
    if (b.id === toId) {
      const nb = cloneBin(b)
      const existing = nb.items.find((it) => it.name === name)
      if (existing) existing.qty += qty
      else nb.items.push({ name, qty })
      return nb
    }
    return b
  })
  return { ok: true, bins: next }
}
