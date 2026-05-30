export type BinItem = {
  name: string
  qty: number
}

export type Bin = {
  id: string
  code: string
  capacity: number
  items: BinItem[]
}

export type Route = 'bins' | 'bin-detail' | 'move' | 'map'
export type Theme = 'light' | 'dark'

export function used(bin: Bin): number {
  let total = 0
  bin.items.forEach((it) => {
    total += it.qty
  })
  return total
}

export function freeSpace(bin: Bin): number {
  return Math.max(0, bin.capacity - used(bin))
}

export function usagePct(bin: Bin): number {
  if (bin.capacity <= 0) return 0
  return Math.round((used(bin) / bin.capacity) * 100)
}

export function isFull(bin: Bin): boolean {
  return used(bin) >= bin.capacity
}
