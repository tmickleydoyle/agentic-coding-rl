import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string | RegExp) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, screenName: string) {
  await u.clear(screen.getByLabelText('Note'))
  await u.type(screen.getByLabelText('Note'), note)
  await u.clear(screen.getByLabelText('Screen'))
  await u.type(screen.getByLabelText('Screen'), screenName)
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

describe('Design Feedback Tracker (held-out)', () => {
  it('nav button shows open count after three adds with one addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Note X', 'Screen X')
    await addFeedback(u, 'Note Y', 'Screen Y')
    await addFeedback(u, 'Note Z', 'Screen Z')
    const btns = screen.getAllByRole('button', { name: /mark addressed/i })
    await u.click(btns[1])
    expect(screen.getByRole('button', { name: 'Feedback (2)' })).toBeInTheDocument()
  })

  it('reopening an item increments the nav open count again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Reopen me', 'About')
    await u.click(screen.getByRole('button', { name: /mark addressed/i }))
    expect(screen.getByRole('button', { name: 'Feedback (0)' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /reopen/i }))
    expect(screen.getByRole('button', { name: 'Feedback (1)' })).toBeInTheDocument()
  })

  it('Open only filter shows no items when all are addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Done one', 'Contact')
    await u.click(screen.getByRole('button', { name: /mark addressed/i }))
    await u.click(screen.getByRole('button', { name: 'Open only' }))
    expect(screen.queryByText('Done one')).not.toBeInTheDocument()
  })

  it('addressed rate rounds correctly for one of three addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'P', 'S1')
    await addFeedback(u, 'Q', 'S2')
    await addFeedback(u, 'R', 'S3')
    await u.click(screen.getAllByRole('button', { name: /mark addressed/i })[0])
    await nav(u, 'Summary')
    expect(screen.getByText('Addressed rate: 33%')).toBeInTheDocument()
  })

  it('Summary open count matches nav badge count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Alpha', 'Home')
    await addFeedback(u, 'Beta', 'Home')
    await addFeedback(u, 'Gamma', 'Home')
    await u.click(screen.getAllByRole('button', { name: /mark addressed/i })[2])
    await nav(u, 'Summary')
    const openText = screen.getByText('Open: 2')
    expect(openText).toBeInTheDocument()
    await nav(u, /feedback/i)
    expect(screen.getByRole('button', { name: 'Feedback (2)' })).toBeInTheDocument()
  })

  it('filter state resets are not required — filter persists within session', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Visible', 'PageV')
    await addFeedback(u, 'Hidden', 'PageH')
    await u.click(screen.getAllByRole('button', { name: /mark addressed/i })[1])
    await u.click(screen.getByRole('button', { name: 'Open only' }))
    expect(screen.getByText('Visible')).toBeInTheDocument()
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('feedback items added before navigating persist on return', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Stays here', 'Persist')
    await nav(u, 'Settings')
    await nav(u, 'Summary')
    await nav(u, /feedback/i)
    expect(screen.getByText('Stays here')).toBeInTheDocument()
    expect(screen.getByText('Persist')).toBeInTheDocument()
  })

  it('two of two addressed gives 100% rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Fix A', 'ScreenA')
    await addFeedback(u, 'Fix B', 'ScreenB')
    const btns = screen.getAllByRole('button', { name: /mark addressed/i })
    await u.click(btns[0])
    await u.click(btns[1])
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 2')).toBeInTheDocument()
    expect(screen.getByText('Addressed rate: 100%')).toBeInTheDocument()
  })
})
