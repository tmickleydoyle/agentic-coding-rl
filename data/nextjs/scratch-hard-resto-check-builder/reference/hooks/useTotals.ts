'use client'
import { useApp } from './useApp'

export function useTotals() {
  const { lines, discount, itemById } = useApp()
  let subtotal = 0
  lines.forEach((l) => {
    const it = itemById(l.itemId)
    if (it) subtotal += it.price * l.qty
  })
  const discountAmt = subtotal * (discount / 100)
  const taxable = subtotal - discountAmt
  const tax = taxable * 0.1
  const total = taxable + tax
  return { subtotal, discountAmt, taxable, tax, total }
}
