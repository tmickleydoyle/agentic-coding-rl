import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CommandPalette from '../components/CommandPalette'
import type { Command } from '../components/types'

function makeCommands() {
  const calls: string[] = []
  const mk = (id: string, label: string, category: string): Command => ({
    id,
    label,
    category,
    run: () => calls.push(id),
  })
  const commands = [
    mk('new', 'New File', 'File'),
    mk('open', 'Open File', 'File'),
    mk('save', 'Save', 'File'),
    mk('cut', 'Cut', 'Edit'),
    mk('copy', 'Copy', 'Edit'),
  ]
  return { commands, calls }
}

function activeId(): string | null {
  const el = screen
    .getAllByTestId(/^cmd-/)
    .find((b) => b.getAttribute('aria-selected') === 'true')
  return el ? el.getAttribute('data-testid')!.slice('cmd-'.length) : null
}

describe('Command palette', () => {
  it('renders all commands grouped by category in first-seen order', () => {
    const { commands } = makeCommands()
    render(<CommandPalette commands={commands} />)
    expect(screen.getByTestId('group-File')).toBeInTheDocument()
    expect(screen.getByTestId('group-Edit')).toBeInTheDocument()
    expect(screen.getByTestId('group-header-File')).toHaveTextContent('File')
    expect(screen.getAllByTestId(/^cmd-/)).toHaveLength(5)
  })

  it('highlights the first command initially', () => {
    const { commands } = makeCommands()
    render(<CommandPalette commands={commands} />)
    expect(activeId()).toBe('new')
  })

  it('filters by case-insensitive label substring', async () => {
    const { commands } = makeCommands()
    const user = userEvent.setup()
    render(<CommandPalette commands={commands} />)
    await user.type(screen.getByTestId('palette-input'), 'file')
    // matches New File, Open File
    const ids = screen.getAllByTestId(/^cmd-/).map((b) => b.getAttribute('data-testid'))
    expect(ids).toEqual(['cmd-new', 'cmd-open'])
    expect(screen.queryByTestId('group-Edit')).toBeNull()
  })

  it('ArrowDown moves the highlight across group boundaries', async () => {
    const { commands } = makeCommands()
    const user = userEvent.setup()
    render(<CommandPalette commands={commands} />)
    const input = screen.getByTestId('palette-input')
    input.focus()
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}') // new->open->save->cut
    expect(activeId()).toBe('cut')
  })

  it('ArrowDown wraps from the last command to the first', async () => {
    const { commands } = makeCommands()
    const user = userEvent.setup()
    render(<CommandPalette commands={commands} />)
    screen.getByTestId('palette-input').focus()
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}') // -> copy (last)
    expect(activeId()).toBe('copy')
    await user.keyboard('{ArrowDown}')
    expect(activeId()).toBe('new')
  })

  it('ArrowUp wraps from the first command to the last', async () => {
    const { commands } = makeCommands()
    const user = userEvent.setup()
    render(<CommandPalette commands={commands} />)
    screen.getByTestId('palette-input').focus()
    await user.keyboard('{ArrowUp}')
    expect(activeId()).toBe('copy')
  })

  it('Enter runs the highlighted command', async () => {
    const { commands, calls } = makeCommands()
    const user = userEvent.setup()
    render(<CommandPalette commands={commands} />)
    screen.getByTestId('palette-input').focus()
    await user.keyboard('{ArrowDown}{Enter}') // open
    expect(calls).toEqual(['open'])
  })

  it('clicking a command runs that command', async () => {
    const { commands, calls } = makeCommands()
    const user = userEvent.setup()
    render(<CommandPalette commands={commands} />)
    await user.click(screen.getByTestId('cmd-copy'))
    expect(calls).toEqual(['copy'])
  })

  it('Escape clears the query and restores all commands', async () => {
    const { commands } = makeCommands()
    const user = userEvent.setup()
    render(<CommandPalette commands={commands} />)
    const input = screen.getByTestId('palette-input') as HTMLInputElement
    await user.type(input, 'cut')
    expect(screen.getAllByTestId(/^cmd-/)).toHaveLength(1)
    input.focus()
    await user.keyboard('{Escape}')
    expect(input.value).toBe('')
    expect(screen.getAllByTestId(/^cmd-/)).toHaveLength(5)
  })

  it('changing the filter resets the highlight to the first result', async () => {
    const { commands } = makeCommands()
    const user = userEvent.setup()
    render(<CommandPalette commands={commands} />)
    const input = screen.getByTestId('palette-input')
    input.focus()
    await user.keyboard('{ArrowDown}{ArrowDown}') // move to save
    expect(activeId()).toBe('save')
    await user.type(input, 'o') // matches Open File, Copy -> highlight resets to first
    expect(activeId()).toBe('open')
  })

  it('shows an empty state when nothing matches and Enter is a no-op', async () => {
    const { commands, calls } = makeCommands()
    const user = userEvent.setup()
    render(<CommandPalette commands={commands} />)
    const input = screen.getByTestId('palette-input')
    await user.type(input, 'zzz')
    expect(screen.getByTestId('empty')).toBeInTheDocument()
    expect(screen.queryAllByTestId(/^cmd-/)).toHaveLength(0)
    input.focus()
    await user.keyboard('{Enter}')
    expect(calls).toEqual([])
  })
})
