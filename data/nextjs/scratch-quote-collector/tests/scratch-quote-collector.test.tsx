import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Quote Collector App', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /quote collector/i })).toBeInTheDocument()
  })

  it('shows 4 seed quotes', () => {
    render(<App />)
    expect(screen.getAllByTestId('quote-item')).toHaveLength(4)
  })

  it('shows correct initial count', () => {
    render(<App />)
    expect(screen.getByTestId('quote-count').textContent).toBe('Showing 4 quote(s)')
  })

  it('displays author with em-dash prefix', () => {
    render(<App />)
    const authors = screen.getAllByTestId('quote-author').map(el => el.textContent)
    expect(authors).toContain('— Steve Jobs')
  })

  it('adds a new quote', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/quote text/i), 'Be yourself.')
    await user.type(screen.getByLabelText(/author/i), 'Oscar Wilde')
    await user.type(screen.getByLabelText(/category/i), 'Wisdom')
    await user.click(screen.getByRole('button', { name: /add quote/i }))
    expect(screen.getAllByTestId('quote-item')).toHaveLength(5)
    const texts = screen.getAllByTestId('quote-text').map(el => el.textContent)
    expect(texts).toContain('Be yourself.')
  })

  it('clears form after adding', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/quote text/i), 'Some quote.')
    await user.type(screen.getByLabelText(/author/i), 'Someone')
    await user.click(screen.getByRole('button', { name: /add quote/i }))
    expect(screen.getByLabelText(/quote text/i)).toHaveValue('')
    expect(screen.getByLabelText(/author/i)).toHaveValue('')
  })

  it('defaults category to General when blank', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/quote text/i), 'A thought.')
    await user.type(screen.getByLabelText(/author/i), 'Thinker')
    await user.click(screen.getByRole('button', { name: /add quote/i }))
    const items = screen.getAllByTestId('quote-item')
    const last = items[items.length - 1]
    expect(within(last).getByTestId('quote-category').textContent).toBe('General')
  })

  it('does not add quote when text is empty', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/author/i), 'Someone')
    await user.click(screen.getByRole('button', { name: /add quote/i }))
    expect(screen.getAllByTestId('quote-item')).toHaveLength(4)
  })

  it('filters by category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/filter by category/i), 'Motivation')
    expect(screen.getAllByTestId('quote-item')).toHaveLength(2)
    expect(screen.getByTestId('quote-count').textContent).toBe('Showing 2 quote(s)')
  })

  it('shows all quotes when All selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/filter by category/i), 'Wisdom')
    await user.selectOptions(screen.getByLabelText(/filter by category/i), 'All')
    expect(screen.getAllByTestId('quote-item')).toHaveLength(4)
  })

  it('removes a quote', async () => {
    const user = userEvent.setup()
    render(<App />)
    const items = screen.getAllByTestId('quote-item')
    await user.click(within(items[0]).getByRole('button', { name: /remove/i }))
    expect(screen.getAllByTestId('quote-item')).toHaveLength(3)
  })

  it('category disappears from filter after all its quotes removed', async () => {
    const user = userEvent.setup()
    render(<App />)
    // Remove only Wisdom quote (id=2)
    const items = screen.getAllByTestId('quote-item')
    const wisdomItem = items.find(el => within(el).queryByTestId('quote-category')?.textContent === 'Wisdom')!
    await user.click(within(wisdomItem).getByRole('button', { name: /remove/i }))
    const select = screen.getByLabelText(/filter by category/i)
    expect(within(select).queryByRole('option', { name: 'Wisdom' })).toBeNull()
  })
})
