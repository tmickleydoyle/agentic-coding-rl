import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('API Docs', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders heading', () => {
    expect(screen.getByRole('heading', { name: /api docs/i })).toBeInTheDocument()
  })

  it('shows 4 seed endpoints', () => {
    expect(screen.getAllByTestId('endpoint-item')).toHaveLength(4)
  })

  it('shows correct total count', () => {
    expect(screen.getByTestId('count-total').textContent).toContain('4')
  })

  it('shows correct deprecated count', () => {
    expect(screen.getByTestId('count-deprecated').textContent).toContain('1')
  })

  it('adds a new endpoint', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/path/i), '/api/comments')
    await user.type(screen.getByLabelText(/description/i), 'List comments')
    await user.type(screen.getByLabelText(/tag/i), 'Comments')
    await user.click(screen.getByRole('button', { name: /add endpoint/i }))
    expect(screen.getAllByTestId('endpoint-item')).toHaveLength(5)
    expect(screen.getByTestId('count-total').textContent).toContain('5')
  })

  it('does not add with empty path', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add endpoint/i }))
    expect(screen.getAllByTestId('endpoint-item')).toHaveLength(4)
  })

  it('adds deprecated endpoint correctly', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/path/i), '/api/old')
    await user.click(screen.getByLabelText(/deprecated/i))
    await user.click(screen.getByRole('button', { name: /add endpoint/i }))
    const items = screen.getAllByTestId('endpoint-item')
    const last = items[items.length - 1]
    expect(within(last).getByTestId('endpoint-deprecated').textContent).toBe('Yes')
    expect(screen.getByTestId('count-deprecated').textContent).toContain('2')
  })

  it('deletes an endpoint', async () => {
    const user = userEvent.setup()
    const items = screen.getAllByTestId('endpoint-item')
    await user.click(within(items[0]).getByRole('button', { name: /delete/i }))
    expect(screen.getAllByTestId('endpoint-item')).toHaveLength(3)
    expect(screen.getByTestId('count-total').textContent).toContain('3')
  })

  it('filters by tag', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by tag/i), 'Posts')
    expect(screen.getAllByTestId('endpoint-item')).toHaveLength(2)
    const tags = screen.getAllByTestId('endpoint-tag').map(el => el.textContent)
    tags.forEach(t => expect(t).toBe('Posts'))
  })

  it('filters by method', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by method/i), 'GET')
    expect(screen.getAllByTestId('endpoint-item')).toHaveLength(2)
    const methods = screen.getAllByTestId('endpoint-method').map(el => el.textContent)
    methods.forEach(m => expect(m).toBe('GET'))
  })

  it('applies both filters simultaneously', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by tag/i), 'Posts')
    await user.selectOptions(screen.getByLabelText(/filter by method/i), 'DELETE')
    expect(screen.getAllByTestId('endpoint-item')).toHaveLength(1)
  })

  it('global counts unchanged when filters active', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by tag/i), 'Users')
    expect(screen.getByTestId('count-total').textContent).toContain('4')
    expect(screen.getByTestId('count-deprecated').textContent).toContain('1')
  })

  it('clears form after add', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/path/i), '/api/test')
    await user.click(screen.getByRole('button', { name: /add endpoint/i }))
    expect(screen.getByLabelText(/path/i)).toHaveValue('')
  })
})
