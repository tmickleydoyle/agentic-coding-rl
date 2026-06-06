import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Contact Book', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('shows 4 seed contacts', () => {
    expect(screen.getAllByTestId('contact-row')).toHaveLength(4)
  })

  it('shows count of 4 contacts', () => {
    expect(screen.getByTestId('count')).toHaveTextContent('4 contacts')
  })

  it('displays seed contact names', () => {
    const rows = screen.getAllByTestId('contact-row')
    expect(rows[0]).toHaveTextContent('Alice Johnson')
    expect(rows[1]).toHaveTextContent('Bob Smith')
  })

  it('contacts are sorted alphabetically', () => {
    const rows = screen.getAllByTestId('contact-row')
    expect(rows[0]).toHaveTextContent('Alice Johnson')
    expect(rows[3]).toHaveTextContent('David Brown')
  })

  it('adds a new contact', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^name$/i), 'Eve Adams')
    await user.type(screen.getByLabelText(/^email$/i), 'eve@example.com')
    await user.type(screen.getByLabelText(/^phone$/i), '555-0105')
    await user.click(screen.getByRole('button', { name: /add contact/i }))
    expect(screen.getAllByTestId('contact-row')).toHaveLength(5)
    expect(screen.getByText('Eve Adams')).toBeInTheDocument()
  })

  it('new contact appears in sorted position', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^name$/i), 'Aaron Zed')
    await user.type(screen.getByLabelText(/^email$/i), 'aaron@example.com')
    await user.click(screen.getByRole('button', { name: /add contact/i }))
    const rows = screen.getAllByTestId('contact-row')
    expect(rows[0]).toHaveTextContent('Aaron Zed')
  })

  it('clears form fields after adding', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^name$/i), 'Test User')
    await user.type(screen.getByLabelText(/^email$/i), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /add contact/i }))
    expect(screen.getByLabelText(/^name$/i)).toHaveValue('')
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('')
  })

  it('does not add contact when name is empty', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^email$/i), 'noname@example.com')
    await user.click(screen.getByRole('button', { name: /add contact/i }))
    expect(screen.getAllByTestId('contact-row')).toHaveLength(4)
  })

  it('does not add contact when email is empty', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^name$/i), 'No Email')
    await user.click(screen.getByRole('button', { name: /add contact/i }))
    expect(screen.getAllByTestId('contact-row')).toHaveLength(4)
  })

  it('deletes a contact', async () => {
    const user = userEvent.setup()
    const rows = screen.getAllByTestId('contact-row')
    await user.click(within(rows[0]).getByRole('button', { name: /delete/i }))
    expect(screen.getAllByTestId('contact-row')).toHaveLength(3)
    expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument()
  })

  it('updates count after delete', async () => {
    const user = userEvent.setup()
    const rows = screen.getAllByTestId('contact-row')
    await user.click(within(rows[0]).getByRole('button', { name: /delete/i }))
    expect(screen.getByTestId('count')).toHaveTextContent('3 contacts')
  })

  it('filters contacts by name', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/search/i), 'alice')
    expect(screen.getAllByTestId('contact-row')).toHaveLength(1)
    expect(screen.getByTestId('count')).toHaveTextContent('1 contacts')
  })

  it('filters contacts by email', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/search/i), 'bob@')
    expect(screen.getAllByTestId('contact-row')).toHaveLength(1)
    expect(screen.getAllByTestId('contact-row')[0]).toHaveTextContent('Bob Smith')
  })

  it('restores all contacts when search is cleared', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/search/i), 'carol')
    await user.clear(screen.getByLabelText(/search/i))
    expect(screen.getAllByTestId('contact-row')).toHaveLength(4)
  })
})
