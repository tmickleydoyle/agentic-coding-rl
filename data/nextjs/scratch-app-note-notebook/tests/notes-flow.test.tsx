import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function openPersonal(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('open-nb1'))
}

describe('notes flow', () => {
  it('orders pinned notes first', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-nb2')) // Work has only n2 (pinned)
    await user.click(screen.getByTestId('nav-notebooks'))
    await openPersonal(user)
    // pin n1 so it should jump ahead of n3
    await user.click(screen.getByTestId('pin-n1'))
    const rows = screen.getAllByTestId(/^note-n\d+$/)
    expect(rows[0]).toHaveAttribute('data-testid', 'note-n1')
    expect(screen.getByTestId('note-n1')).toHaveAttribute('data-pinned', 'true')
  })

  it('deletes a note', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openPersonal(user)
    expect(screen.getByTestId('note-n3')).toBeInTheDocument()
    await user.click(screen.getByTestId('delete-n3'))
    expect(screen.queryByTestId('note-n3')).not.toBeInTheDocument()
  })

  it('filters notes by tag', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openPersonal(user)
    await user.selectOptions(screen.getByTestId('tag-filter'), 'writing')
    expect(screen.getByTestId('note-n3')).toBeInTheDocument()
    expect(screen.queryByTestId('note-n1')).not.toBeInTheDocument()
  })

  it('shows an empty state when a tag filter matches nothing', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openPersonal(user)
    await user.selectOptions(screen.getByTestId('tag-filter'), 'errand')
    await user.click(screen.getByTestId('delete-n1')) // only errand note removed
    expect(screen.getByTestId('notes-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('note-list')).not.toBeInTheDocument()
  })

  it('creates a new note via the editor and shows it in the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openPersonal(user)
    await user.click(screen.getByTestId('new-note'))
    expect(screen.getByTestId('page-editor')).toBeInTheDocument()
    await user.type(screen.getByTestId('title-input'), 'Fresh idea')
    await user.type(screen.getByTestId('tags-input'), 'writing, draft')
    await user.click(screen.getByTestId('save-note'))
    expect(screen.getByTestId('page-notes')).toBeInTheDocument()
    expect(within(screen.getByTestId('note-list')).getByText('Fresh idea')).toBeInTheDocument()
  })

  it('blocks saving a note with an empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openPersonal(user)
    await user.click(screen.getByTestId('new-note'))
    await user.click(screen.getByTestId('save-note'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-editor')).toBeInTheDocument()
  })

  it('edits an existing note and persists the new title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openPersonal(user)
    await user.click(screen.getByTestId('edit-n1'))
    const title = screen.getByTestId('title-input') as HTMLInputElement
    expect(title.value).toBe('Grocery list')
    await user.clear(title)
    await user.type(title, 'Shopping list')
    await user.click(screen.getByTestId('save-note'))
    expect(within(screen.getByTestId('note-list')).getByText('Shopping list')).toBeInTheDocument()
    expect(screen.queryByText('Grocery list')).not.toBeInTheDocument()
  })

  it('toggles pin off again', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-nb2'))
    expect(screen.getByTestId('note-n2')).toHaveAttribute('data-pinned', 'true')
    await user.click(screen.getByTestId('pin-n2'))
    expect(screen.getByTestId('note-n2')).toHaveAttribute('data-pinned', 'false')
  })
})
