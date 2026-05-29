'use client'
import type { KeyboardEvent } from 'react'
import type { MenuItem } from './types'
import { useMenu } from '../hooks/useMenu'
import MenuItemView from './MenuItemView'

export default function Menu({
  items,
  onSelect,
}: {
  items: MenuItem[]
  onSelect: (id: string) => void
}) {
  const { open, highlight, toggle, close, moveDown, moveUp } = useMenu(items.length)

  const activate = (id: string) => {
    onSelect(id)
    close()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      moveDown()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      moveUp()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      activate(items[highlight].id)
    } else if (e.key === 'Escape') {
      close()
    }
  }

  return (
    <div>
      <button data-testid="trigger" onClick={toggle}>
        Menu
      </button>
      {open && (
        <ul data-testid="menu" tabIndex={-1} onKeyDown={onKeyDown}>
          {items.map((item, i) => (
            <MenuItemView
              key={item.id}
              item={item}
              index={i}
              highlighted={i === highlight}
              onActivate={activate}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
