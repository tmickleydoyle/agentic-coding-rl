import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Release Notes', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders heading', () => {
    expect(screen.getByRole('heading', { name: /release notes/i })).toBeInTheDocument()
  })

  it('shows 3 seed notes', () => {
    expect(screen.getAllByTestId('note-item')).toHaveLength(3)
  })

  it('shows correct published count', () => {
    expect(screen.getByTestId('count-published').textContent).toContain('2')
  })

  it('shows correct draft count', () => {
    expect(screen.getByTestId('count-draft').textContent).toContain('1')
  })

  it('adds a new note', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/title/i), 'New feature arrived')
    await user.type(screen.getByLabelText(/version/i), '3.0.0')
    await user.click(screen.getByRole('button', { name: /add note/i }))
    expect(screen.getAllByTestId('note-item')).toHaveLength(4)
    const titles = screen.getAllByTestId('note-title').map(el => el.textContent)
    expect(titles).toContain('New feature arrived')
  })

  it('new note starts as draft', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/title/i), 'Draft test')
    await user.click(screen.getByRole('button', { name: /add note/i }))
    const items = screen.getAllByTestId('note-item')
    const last = items[items.length - 1]
    expect(within(last).getByTestId('note-status').textContent).toBe('Draft')
  })

  it('does not add note with empty title', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add note/i }))
    expect(screen.getAllByTestId('note-item')).toHaveLength(3)
  })

  it('clears form after add', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/title/i), 'Temp note')
    await user.click(screen.getByRole('button', { name: /add note/i }))
    expect(screen.getByLabelText(/title/i)).toHaveValue('')
  })

  it('publishes a draft note', async () => {
    const user = userEvent.setup()
    const items = screen.getAllByTestId('note-item')
    const draftItem = items[2]
    expect(within(draftItem).getByTestId('note-status').textContent).toBe('Draft')
    await user.click(within(draftItem).getByRole('button', { name: /publish/i }))
    expect(within(draftItem).getByTestId('note-status').textContent).toBe('Published')
  })

  it('unpublishes a published note', async () => {
    const user = userEvent.setup()
    const items = screen.getAllByTestId('note-item')
    const publishedItem = items[0]
    expect(within(publishedItem).getByTestId('note-status').textContent).toBe('Published')
    await user.click(within(publishedItem).getByRole('button', { name: /unpublish/i }))
    expect(within(publishedItem).getByTestId('note-status').textContent).toBe('Draft')
  })

  it('deletes a note', async () => {
    const user = userEvent.setup()
    const items = screen.getAllByTestId('note-item')
    await user.click(within(items[0]).getByRole('button', { name: /delete/i }))
    expect(screen.getAllByTestId('note-item')).toHaveLength(2)
  })

  it('filters by category', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by category/i), 'bugfix')
    expect(screen.getAllByTestId('note-item')).toHaveLength(1)
    expect(screen.getByTestId('note-category').textContent).toBe('bugfix')
  })

  it('filters by product', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by product/i), 'Web App')
    expect(screen.getAllByTestId('note-item')).toHaveLength(2)
    const products = screen.getAllByTestId('note-product').map(el => el.textContent)
    products.forEach(p => expect(p).toBe('Web App'))
  })

  it('applies both filters simultaneously', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by product/i), 'Web App')
    await user.selectOptions(screen.getByLabelText(/filter by category/i), 'feature')
    expect(screen.getAllByTestId('note-item')).toHaveLength(1)
  })

  it('global counts unchanged when filters active', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by category/i), 'bugfix')
    expect(screen.getByTestId('count-published').textContent).toContain('2')
    expect(screen.getByTestId('count-draft').textContent).toContain('1')
  })
})
