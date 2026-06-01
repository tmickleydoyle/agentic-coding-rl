import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('list flow', () => {
  it('lists the seeded notes with word counts', () => {
    render(<App />)
    const list = screen.getByTestId('note-list')
    expect(within(list).getByTestId('note-m1-title')).toHaveTextContent('Welcome')
    // body '# Hello\n\nThis is **bold**.' => 5 words
    expect(screen.getByTestId('note-m1-words')).toHaveTextContent('5')
    // body '- one\n- two' => 4 words
    expect(screen.getByTestId('note-m2-words')).toHaveTextContent('4')
  })

  it('shows no active filter by default', () => {
    render(<App />)
    expect(screen.getByTestId('active-filter')).toHaveTextContent('none')
  })

  it('deletes a note', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('note-m3')).toBeInTheDocument()
    await user.click(screen.getByTestId('delete-m3'))
    expect(screen.queryByTestId('note-m3')).not.toBeInTheDocument()
  })

  it('shows an empty state after deleting all notes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('delete-m1'))
    await user.click(screen.getByTestId('delete-m2'))
    await user.click(screen.getByTestId('delete-m3'))
    expect(screen.getByTestId('list-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('note-list')).not.toBeInTheDocument()
  })

  it('creates a note from the editor and lists it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('new-note'))
    await user.type(screen.getByTestId('title-input'), 'Brand new')
    await user.type(screen.getByTestId('body-input'), 'just three words')
    await user.click(screen.getByTestId('save-note'))
    expect(screen.getByTestId('page-list')).toBeInTheDocument()
    const list = screen.getByTestId('note-list')
    expect(within(list).getByText('Brand new')).toBeInTheDocument()
    expect(screen.getByTestId('note-m4-words')).toHaveTextContent('3')
  })
})
