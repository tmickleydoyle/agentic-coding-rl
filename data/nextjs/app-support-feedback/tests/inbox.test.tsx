import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('inbox list', () => {
  it('lists all seeded feedback', () => {
    render(<App />)
    const list = screen.getByTestId('feedback-list')
    expect(within(list).getByText('Sam')).toBeInTheDocument()
    expect(within(list).getByText('Rae')).toBeInTheDocument()
    expect(screen.getByTestId('inbox-count')).toHaveTextContent('4')
  })

  it('shows status and sentiment data attributes on items', () => {
    render(<App />)
    expect(screen.getByTestId('fb-f2')).toHaveAttribute('data-sentiment', 'negative')
    expect(screen.getByTestId('fb-f4')).toHaveAttribute('data-status', 'resolved')
  })

  it('filters by category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('category-filter'), 'UI')
    expect(screen.getByTestId('fb-f1')).toBeInTheDocument()
    expect(screen.getByTestId('fb-f4')).toBeInTheDocument()
    expect(screen.queryByTestId('fb-f2')).not.toBeInTheDocument()
    expect(screen.getByTestId('inbox-count')).toHaveTextContent('2')
  })

  it('shows empty state when a category has no items after filtering', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('category-filter'), 'Bug')
    expect(screen.getByTestId('fb-f2')).toBeInTheDocument()
    expect(screen.getByTestId('inbox-count')).toHaveTextContent('1')
  })
})

describe('add feedback', () => {
  it('blocks submit when author or message missing', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('author-input'), 'Pat')
    await user.click(screen.getByTestId('submit-feedback'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds feedback that appears in the inbox', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('author-input'), 'Pat')
    await user.type(screen.getByTestId('message-input'), 'Great support!')
    await user.type(screen.getByTestId('new-category-input'), 'Praise')
    await user.selectOptions(screen.getByTestId('sentiment-select'), 'positive')
    await user.click(screen.getByTestId('submit-feedback'))
    expect(within(screen.getByTestId('feedback-list')).getByText('Pat')).toBeInTheDocument()
    expect(screen.getByTestId('inbox-count')).toHaveTextContent('5')
  })
})
