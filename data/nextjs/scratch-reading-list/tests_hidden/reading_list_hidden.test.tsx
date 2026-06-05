// HELD-OUT generalization tests — overlaid only at eval.
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

describe('Reading List (held-out)', () => {
  it('adding three books yields correct summary with all Want to read', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'Alpha')
    await addBook(u, 'Beta')
    await addBook(u, 'Gamma')
    expect(screen.getByText('Total: 3 | Want to read: 3 | Reading: 0 | Finished: 0')).toBeInTheDocument()
    expect(screen.getByText('Finished: 0%')).toBeInTheDocument()
  })

  it('mixed statuses produce correct counts and floored percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'A')
    await addBook(u, 'B')
    await addBook(u, 'C')
    await setStatus(u, 'A', 'Reading')
    await setStatus(u, 'B', 'Finished')
    // total=3, want=1, reading=1, finished=1, pct=floor(1/3*100)=33
    expect(screen.getByText('Total: 3 | Want to read: 1 | Reading: 1 | Finished: 1')).toBeInTheDocument()
    expect(screen.getByText('Finished: 33%')).toBeInTheDocument()
  })

  it('removing a finished book updates percent correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'X')
    await addBook(u, 'Y')
    await setStatus(u, 'X', 'Finished')
    await setStatus(u, 'Y', 'Finished')
    // both finished, pct=100
    expect(screen.getByText('Finished: 100%')).toBeInTheDocument()
    const liX = screen.getByText('X').closest('li') as HTMLElement
    await u.click(within(liX).getByRole('button', { name: /remove/i }))
    // now 1 total, 1 finished, pct=100 still
    expect(screen.getByText('Total: 1 | Want to read: 0 | Reading: 0 | Finished: 1')).toBeInTheDocument()
    expect(screen.getByText('Finished: 100%')).toBeInTheDocument()
  })

  it('Finished filter hides non-finished and keeps summary accurate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'P')
    await addBook(u, 'Q')
    await addBook(u, 'R')
    await setStatus(u, 'R', 'Finished')
    await u.click(screen.getByRole('button', { name: 'Finished' }))
    expect(screen.getByText('R')).toBeInTheDocument()
    expect(screen.queryByText('P')).not.toBeInTheDocument()
    expect(screen.queryByText('Q')).not.toBeInTheDocument()
    // summary still counts all books
    expect(screen.getByText('Total: 3 | Want to read: 2 | Reading: 0 | Finished: 1')).toBeInTheDocument()
  })

  it('status select has three correct options', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'MyBook')
    const select = screen.getByRole('combobox', { name: 'MyBook' })
    const options = within(select as HTMLElement).getAllByRole('option')
    const optionValues = options.map((o: HTMLElement) => o.textContent)
    expect(optionValues).toContain('Want to read')
    expect(optionValues).toContain('Reading')
    expect(optionValues).toContain('Finished')
    expect(options).toHaveLength(3)
  })

  it('whitespace-only title does not add a book', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/book title/i), '   ')
    await u.click(screen.getByRole('button', { name: /add book/i }))
    expect(screen.getByText('Total: 0 | Want to read: 0 | Reading: 0 | Finished: 0')).toBeInTheDocument()
  })

  it('can change status back to Want to read after setting to Reading', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'Revert')
    await setStatus(u, 'Revert', 'Reading')
    await setStatus(u, 'Revert', 'Want to read')
    expect(screen.getByRole('combobox', { name: 'Revert' })).toHaveValue('Want to read')
    expect(screen.getByText('Total: 1 | Want to read: 1 | Reading: 0 | Finished: 0')).toBeInTheDocument()
  })

  it('Reading filter shows only Reading books after multiple status changes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBook(u, 'Book1')
    await addBook(u, 'Book2')
    await addBook(u, 'Book3')
    await setStatus(u, 'Book1', 'Reading')
    await setStatus(u, 'Book2', 'Finished')
    await u.click(screen.getByRole('button', { name: 'Reading' }))
    expect(screen.getByText('Book1')).toBeInTheDocument()
    expect(screen.queryByText('Book2')).not.toBeInTheDocument()
    expect(screen.queryByText('Book3')).not.toBeInTheDocument()
  })
})
