import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

function col(name: string): HTMLElement {
  return screen.getByRole('region', { name })
}

function liFor(name: string): HTMLElement {
  const li = screen.getByText(name).closest('li')
  if (!li) throw new Error(`no <li> for ${name}`)
  return li as HTMLElement
}

async function addCard(u: ReturnType<typeof userEvent.setup>, title: string) {
  await u.clear(screen.getByLabelText(/card title/i))
  await u.type(screen.getByLabelText(/card title/i), title)
  await u.click(screen.getByRole('button', { name: /add card/i }))
}

describe('Kanban board', () => {
  it('renders three columns with zero counts initially', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /backlog \(0\)/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /in progress \(0\)/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /done \(0\)/i })).toBeInTheDocument()
  })

  it('adds a card to the Backlog column', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCard(u, 'Ship release')
    expect(within(col('Backlog')).getByText('Ship release')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /backlog \(1\)/i })).toBeInTheDocument()
  })

  it('ignores a blank card title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add card/i }))
    expect(screen.getByRole('heading', { name: /backlog \(0\)/i })).toBeInTheDocument()
  })

  it('clears the input after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCard(u, 'Task A')
    expect(screen.getByLabelText(/card title/i)).toHaveValue('')
  })

  it('disables Move left for a card in Backlog', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCard(u, 'Task A')
    expect(within(liFor('Task A')).getByRole('button', { name: /move left/i })).toBeDisabled()
  })

  it('moves a card right into In Progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCard(u, 'Task A')
    await u.click(within(liFor('Task A')).getByRole('button', { name: /move right/i }))
    expect(within(col('In Progress')).getByText('Task A')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /backlog \(0\)/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /in progress \(1\)/i })).toBeInTheDocument()
  })

  it('moves a card all the way to Done and disables Move right there', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCard(u, 'Task A')
    await u.click(within(liFor('Task A')).getByRole('button', { name: /move right/i }))
    await u.click(within(liFor('Task A')).getByRole('button', { name: /move right/i }))
    expect(within(col('Done')).getByText('Task A')).toBeInTheDocument()
    expect(within(liFor('Task A')).getByRole('button', { name: /move right/i })).toBeDisabled()
  })

  it('moves a card back left', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCard(u, 'Task A')
    await u.click(within(liFor('Task A')).getByRole('button', { name: /move right/i }))
    await u.click(within(liFor('Task A')).getByRole('button', { name: /move left/i }))
    expect(within(col('Backlog')).getByText('Task A')).toBeInTheDocument()
  })

  it('tracks counts across multiple cards and a move', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCard(u, 'A')
    await addCard(u, 'B')
    await addCard(u, 'C')
    expect(screen.getByRole('heading', { name: /backlog \(3\)/i })).toBeInTheDocument()
    await u.click(within(liFor('B')).getByRole('button', { name: /move right/i }))
    expect(screen.getByRole('heading', { name: /backlog \(2\)/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /in progress \(1\)/i })).toBeInTheDocument()
  })

  it('keeps distinct cards independent when moving', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCard(u, 'A')
    await addCard(u, 'B')
    await u.click(within(liFor('A')).getByRole('button', { name: /move right/i }))
    expect(within(col('In Progress')).getByText('A')).toBeInTheDocument()
    expect(within(col('Backlog')).getByText('B')).toBeInTheDocument()
  })
})
