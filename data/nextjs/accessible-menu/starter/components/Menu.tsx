'use client'
import type { MenuItem } from './types'
import { useMenu } from '../hooks/useMenu'
import MenuItemView from './MenuItemView'

// TODO: render <button data-testid="trigger">Menu</button> that toggles the menu. When open,
// render <ul data-testid="menu" tabIndex={-1}> of MenuItemViews (highlighted = hook's highlight).
// The <ul> onKeyDown: ArrowDown->moveDown, ArrowUp->moveUp, Enter->activate highlighted item,
// Escape->close. Activate = onSelect(id) then close. Clicking an item also activates. When
// closed the <ul> is ABSENT from the DOM.
export default function Menu({
  items,
  onSelect,
}: {
  items: MenuItem[]
  onSelect: (id: string) => void
}) {
  const { open, highlight, toggle, close, moveDown, moveUp } = useMenu(items.length)
  return (
    <div>
      <button data-testid="trigger" onClick={toggle}>
        Menu
      </button>
    </div>
  )
}
