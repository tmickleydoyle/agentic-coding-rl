import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('log flow', () => {
  it('shows the latest weight from seed data', () => {
    render(<App />)
    expect(screen.getByTestId('latest-weight')).toHaveTextContent('79')
  })

  it('blocks logging an invalid weight', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('weight-input'), 'abc')
    await user.click(screen.getByTestId('submit-weight'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('latest-weight')).toHaveTextContent('79')
  })

  it('logs a new weight and updates the latest', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('weight-input'), '78.5')
    await user.click(screen.getByTestId('submit-weight'))
    expect(screen.getByTestId('latest-weight')).toHaveTextContent('78.5')
  })

  it('a logged entry appears in history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('weight-input'), '78')
    await user.click(screen.getByTestId('submit-weight'))
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('entry-g4')).toBeInTheDocument()
    expect(screen.getByTestId('entry-g4-weight')).toHaveTextContent('78')
  })

  it('lists seeded entries in chronological order', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    const rows = screen.getByTestId('entry-list').querySelectorAll('li')
    expect(rows[0].getAttribute('data-testid')).toBe('entry-g1')
    expect(rows[2].getAttribute('data-testid')).toBe('entry-g3')
  })

  it('removes an entry from history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    await user.click(screen.getByTestId('remove-g2'))
    expect(screen.queryByTestId('entry-g2')).not.toBeInTheDocument()
  })

  it('shows an empty state when all entries are removed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    await user.click(screen.getByTestId('remove-g1'))
    await user.click(screen.getByTestId('remove-g2'))
    await user.click(screen.getByTestId('remove-g3'))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('entry-list')).not.toBeInTheDocument()
  })
})
