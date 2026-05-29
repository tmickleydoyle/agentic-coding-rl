import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Menu from '../components/Menu'

const ITEMS = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
]

async function openMenu(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('trigger'))
  const menu = screen.getByTestId('menu')
  menu.focus()
  return menu
}

describe('Accessible menu', () => {
  it('is closed initially', () => {
    render(<Menu items={ITEMS} onSelect={() => {}} />)
    expect(screen.queryByTestId('menu')).toBeNull()
  })

  it('trigger opens the menu and highlights the first item', async () => {
    const user = userEvent.setup()
    render(<Menu items={ITEMS} onSelect={() => {}} />)
    await openMenu(user)
    expect(screen.getByTestId('menu')).toBeInTheDocument()
    expect(screen.getByTestId('item-cut')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByTestId('item-copy')).not.toHaveAttribute('aria-selected')
  })

  it('ArrowDown moves the highlight down', async () => {
    const user = userEvent.setup()
    render(<Menu items={ITEMS} onSelect={() => {}} />)
    await openMenu(user)
    await user.keyboard('{ArrowDown}')
    expect(screen.getByTestId('item-copy')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByTestId('item-cut')).not.toHaveAttribute('aria-selected')
  })

  it('ArrowDown wraps from last to first', async () => {
    const user = userEvent.setup()
    render(<Menu items={ITEMS} onSelect={() => {}} />)
    await openMenu(user)
    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(screen.getByTestId('item-paste')).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{ArrowDown}')
    expect(screen.getByTestId('item-cut')).toHaveAttribute('aria-selected', 'true')
  })

  it('ArrowUp wraps from first to last', async () => {
    const user = userEvent.setup()
    render(<Menu items={ITEMS} onSelect={() => {}} />)
    await openMenu(user)
    await user.keyboard('{ArrowUp}')
    expect(screen.getByTestId('item-paste')).toHaveAttribute('aria-selected', 'true')
  })

  it('Enter activates the highlighted item and closes', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<Menu items={ITEMS} onSelect={onSelect} />)
    await openMenu(user)
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onSelect).toHaveBeenCalledWith('copy')
    expect(screen.queryByTestId('menu')).toBeNull()
  })

  it('clicking an item activates it and closes', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<Menu items={ITEMS} onSelect={onSelect} />)
    await user.click(screen.getByTestId('trigger'))
    await user.click(screen.getByText('Paste'))
    expect(onSelect).toHaveBeenCalledWith('paste')
    expect(screen.queryByTestId('menu')).toBeNull()
  })

  it('Escape closes without selecting', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<Menu items={ITEMS} onSelect={onSelect} />)
    await openMenu(user)
    await user.keyboard('{Escape}')
    expect(screen.queryByTestId('menu')).toBeNull()
    expect(onSelect).not.toHaveBeenCalled()
  })
})
