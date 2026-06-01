import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function addBook(u: ReturnType<typeof userEvent.setup>, title: string) {
  await u.clear(screen.getByLabelText(/book title/i))
  await u.type(screen.getByLabelText(/book title/i), title)
  await u.click(screen.getByRole('button', { name: /add book/i }))
}

async function setStatus(u: ReturnType<typeof userEvent.setup>, bookTitle: string, status: string) {
  await u.selectOptions(screen.getByRole('combobox', { name: bookTitle }), status)
}

describe('Reading List', () => {
  it('renders the heading and empty summary on load', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /reading list/i })).toBeInTheDocument()
    expect(screen.getByText('Total: 0 | Want to read: 0 | Reading: 0 | Finished: 0')).toBeInTheDocument()
    expect(screen.getByText('Finished: 0%')).toBeInTheDocument()
  })

  it('shows all four filter buttons', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Want to read' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reading' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Finished' })).toBeInTheDocument()
  })

  it('adds a book with default status Want to read', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'Dune')
    expect(screen.getByText('Dune')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Dune' })).toHaveValue('Want to read')
  })

  it('clears the input after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'Dune')
    expect(screen.getByLabelText(/book title/i)).toHaveValue('')
  })

  it('does not add a book with a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add book/i }))
    expect(screen.getByText('Total: 0 | Want to read: 0 | Reading: 0 | Finished: 0')).toBeInTheDocument()
  })

  it('updates the summary when a book is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'Dune')
    expect(screen.getByText('Total: 1 | Want to read: 1 | Reading: 0 | Finished: 0')).toBeInTheDocument()
  })

  it('updates counts when status changes to Reading', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'Dune')
    await setStatus(u, 'Dune', 'Reading')
    expect(screen.getByText('Total: 1 | Want to read: 0 | Reading: 1 | Finished: 0')).toBeInTheDocument()
  })

  it('updates counts when status changes to Finished', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'Dune')
    await setStatus(u, 'Dune', 'Finished')
    expect(screen.getByText('Total: 1 | Want to read: 0 | Reading: 0 | Finished: 1')).toBeInTheDocument()
  })

  it('shows 100% finished when all books are finished', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'Dune')
    await setStatus(u, 'Dune', 'Finished')
    expect(screen.getByText('Finished: 100%')).toBeInTheDocument()
  })

  it('computes finished percent correctly with multiple books', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'Book A')
    await addBook(u, 'Book B')
    await addBook(u, 'Book C')
    await addBook(u, 'Book D')
    await setStatus(u, 'Book A', 'Finished')
    expect(screen.getByText('Total: 4 | Want to read: 3 | Reading: 0 | Finished: 1')).toBeInTheDocument()
    expect(screen.getByText('Finished: 25%')).toBeInTheDocument()
  })

  it('removes a book and updates summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'Dune')
    await addBook(u, 'Foundation')
    const liDune = screen.getByText('Dune').closest('li') as HTMLElement
    await u.click(within(liDune).getByRole('button', { name: /remove/i }))
    expect(screen.queryByText('Dune')).not.toBeInTheDocument()
    expect(screen.getByText('Total: 1 | Want to read: 1 | Reading: 0 | Finished: 0')).toBeInTheDocument()
  })

  it('filters to only Want to read books', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'Book A')
    await addBook(u, 'Book B')
    await setStatus(u, 'Book B', 'Reading')
    await u.click(screen.getByRole('button', { name: 'Want to read' }))
    expect(screen.getByText('Book A')).toBeInTheDocument()
    expect(screen.queryByText('Book B')).not.toBeInTheDocument()
  })

  it('filters to only Reading books', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'Book A')
    await addBook(u, 'Book B')
    await setStatus(u, 'Book A', 'Reading')
    await u.click(screen.getByRole('button', { name: 'Reading' }))
    expect(screen.getByText('Book A')).toBeInTheDocument()
    expect(screen.queryByText('Book B')).not.toBeInTheDocument()
  })

  it('filters to only Finished books', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'Book A')
    await addBook(u, 'Book B')
    await setStatus(u, 'Book B', 'Finished')
    await u.click(screen.getByRole('button', { name: 'Finished' }))
    expect(screen.queryByText('Book A')).not.toBeInTheDocument()
    expect(screen.getByText('Book B')).toBeInTheDocument()
  })

  it('All filter shows every book', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'Book A')
    await addBook(u, 'Book B')
    await setStatus(u, 'Book A', 'Reading')
    await u.click(screen.getByRole('button', { name: 'Reading' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Book A')).toBeInTheDocument()
    expect(screen.getByText('Book B')).toBeInTheDocument()
  })

  it('summary counts are unaffected by the active filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'Book A')
    await addBook(u, 'Book B')
    await setStatus(u, 'Book A', 'Finished')
    await u.click(screen.getByRole('button', { name: 'Want to read' }))
    expect(screen.getByText('Total: 2 | Want to read: 1 | Reading: 0 | Finished: 1')).toBeInTheDocument()
    expect(screen.getByText('Finished: 50%')).toBeInTheDocument()
  })

  it('finished percent returns to 0% when the last book is removed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'Solo')
    await setStatus(u, 'Solo', 'Finished')
    const liSolo = screen.getByText('Solo').closest('li') as HTMLElement
    await u.click(within(liSolo).getByRole('button', { name: /remove/i }))
    expect(screen.getByText('Finished: 0%')).toBeInTheDocument()
  })
})
