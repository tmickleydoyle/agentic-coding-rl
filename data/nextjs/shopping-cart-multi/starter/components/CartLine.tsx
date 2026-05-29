'use client'
import type { CartLine as CartLineT } from './types'
import { useCartContext } from './CartContext'

// TODO: render <li data-testid={`line-${line.item.id}`}> with "{name} x{qty}" and
// a <button data-testid={`remove-${id}`}> that calls remove(id).
export default function CartLine({ line }: { line: CartLineT }) {
  const { remove } = useCartContext()
  return <li />
}
