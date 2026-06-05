import { describe, it, expect } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

async function addNote(
  u: U,
  opts: { title: string; body?: string; tags?: string },
) {
  await u.clear(screen.getByLabelText(/^title$/i))
  await u.type(screen.getByLabelText(/^title$/i), opts.title)
  if (opts.body !== undefined) {
    fireEvent.change(screen.getByLabelText(/^body$/i), { target: { value: opts.body } })
  }
  if (opts.tags !== undefined) {
    await u.clear(screen.getByLabelText(/^tags$/i))
    await u.type(screen.getByLabelText(/^tags$/i), opts.tags)
  }
  await u.click(screen.getByRole('button', { name: /add note/i }))
}

// The Preview area is the one region the prompt names explicitly; scope markdown
// assertions to it so note-list <li>s don't collide with rendered list items.
function preview(): HTMLElement {
  return screen.getByRole('region', { name: 'Preview' })
}

describe('Markdown notes app', () => {
  it('adds a note and lists its title as a button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addNote(u, { title: 'Shopping' })
    expect(screen.getByRole('button', { name: 'Shopping' })).toBeInTheDocument()
  })

  it('ignores a note with a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addNote(u, { title: '   ' })
    expect(within(preview()).getByText(/no note selected/i)).toBeInTheDocument()
  })

  it('auto-selects the new note and previews its body', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addNote(u, { title: 'Hi', body: 'plain content here' })
    expect(within(preview()).getByText('plain content here')).toBeInTheDocument()
  })

  it('renders a level-1 heading for a "# " line', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addNote(u, { title: 'H', body: '# Hello world' })
    expect(within(preview()).getByRole('heading', { level: 1, name: 'Hello world' })).toBeInTheDocument()
  })

  it('renders a level-2 heading for a "## " line', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addNote(u, { title: 'H', body: '## Subsection' })
    expect(within(preview()).getByRole('heading', { level: 2, name: 'Subsection' })).toBeInTheDocument()
  })

  it('renders bold text wrapped in ** as <strong>', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addNote(u, { title: 'B', body: 'this is **important** stuff' })
    const el = within(preview()).getByText('important')
    expect(el.tagName).toBe('STRONG')
  })

  it('renders consecutive "- " lines as a list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addNote(u, { title: 'L', body: '- apple\n- banana\n- cherry' })
    const items = within(preview()).getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(within(preview()).getByText('apple')).toBeInTheDocument()
    expect(within(preview()).getByText('cherry')).toBeInTheDocument()
  })

  it('renders a plain line as a paragraph', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addNote(u, { title: 'P', body: 'just a sentence' })
    expect(within(preview()).getByText('just a sentence').tagName).toBe('P')
  })

  it('renders a mixed document (heading + list + bold)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addNote(u, { title: 'Doc', body: '# Title\n- one\n- two\na **bold** word' })
    expect(within(preview()).getByRole('heading', { level: 1, name: 'Title' })).toBeInTheDocument()
    expect(within(preview()).getAllByRole('listitem')).toHaveLength(2)
    expect(within(preview()).getByText('bold').tagName).toBe('STRONG')
  })

  it('switches preview when another note is selected', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addNote(u, { title: 'First', body: 'first body text' })
    await addNote(u, { title: 'Second', body: 'second body text' })
    await u.click(screen.getByRole('button', { name: 'First' }))
    expect(within(preview()).getByText('first body text')).toBeInTheDocument()
  })

  it('searches notes by title and body', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addNote(u, { title: 'Groceries', body: 'milk and eggs' })
    await addNote(u, { title: 'Work', body: 'finish the report' })
    await u.type(screen.getByLabelText(/^search$/i), 'milk')
    expect(screen.getByRole('button', { name: 'Groceries' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Work' })).not.toBeInTheDocument()
  })

  it('filters by tag and clears with All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addNote(u, { title: 'Alpha', body: 'x', tags: 'home' })
    await addNote(u, { title: 'Beta', body: 'y', tags: 'office' })
    await u.click(screen.getByRole('button', { name: 'home' }))
    expect(screen.getByRole('button', { name: 'Alpha' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Beta' })).not.toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByRole('button', { name: 'Beta' })).toBeInTheDocument()
  })

  it('applies search and tag filter together', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addNote(u, { title: 'Report draft', body: 'numbers', tags: 'office' })
    await addNote(u, { title: 'Report final', body: 'words', tags: 'home' })
    await u.click(screen.getByRole('button', { name: 'office' }))
    await u.type(screen.getByLabelText(/^search$/i), 'report')
    expect(screen.getByRole('button', { name: 'Report draft' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Report final' })).not.toBeInTheDocument()
  })

  it('deletes the selected note', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addNote(u, { title: 'Temp', body: 'z' })
    await u.click(screen.getByRole('button', { name: /delete note/i }))
    expect(screen.queryByRole('button', { name: 'Temp' })).not.toBeInTheDocument()
  })
})
