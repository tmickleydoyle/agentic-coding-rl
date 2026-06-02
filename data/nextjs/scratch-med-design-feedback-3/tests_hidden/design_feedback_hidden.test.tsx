import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, screenName: string) {
  await u.clear(screen.getByLabelText('Note'))
  await u.clear(screen.getByLabelText('Screen'))
  await u.type(screen.getByLabelText('Note'), note)
  await u.type(screen.getByLabelText('Screen'), screenName)
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

describe('Design Feedback Tracker (held-out)', () => {
  it('Summary total is 0 with no feedback', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total feedback: 0')).toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 0')).toBeInTheDocument()
  })

  it('adding two items shows Total feedback: 2 in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'First issue', 'Home')
    await addFeedback(u, 'Second issue', 'Cart')
    await nav(u, 'Summary')
    expect(screen.getByText('Total feedback: 2')).toBeInTheDocument()
  })

  it('addressed rate is 50% when half are addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Alpha note', 'A')
    await addFeedback(u, 'Beta note', 'B')
    const li = screen.getByText('Alpha note').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /mark addressed/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Addressed rate: 50%')).toBeInTheDocument()
  })

  it('reopening a note updates Summary open count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Reopen me', 'Settings')
    const li = screen.getByText('Reopen me').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /mark addressed/i }))
    await u.click(within(li).getByRole('button', { name: /reopen/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 0')).toBeInTheDocument()
  })

  it('Open only filter shows nothing when all items are addressed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Done A', 'X')
    await addFeedback(u, 'Done B', 'Y')
    const liA = screen.getByText('Done A').closest('li') as HTMLElement
    const liB = screen.getByText('Done B').closest('li') as HTMLElement
    await u.click(within(liA).getByRole('button', { name: /mark addressed/i }))
    await u.click(within(liB).getByRole('button', { name: /mark addressed/i }))
    await u.click(screen.getByRole('button', { name: /open only/i }))
    expect(screen.queryByText('Done A')).not.toBeInTheDocument()
    expect(screen.queryByText('Done B')).not.toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
  })

  it('Mark addressed button disappears after clicking it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Toggle test', 'Dash')
    const li = screen.getByText('Toggle test').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /mark addressed/i }))
    expect(within(li).queryByRole('button', { name: /mark addressed/i })).not.toBeInTheDocument()
    expect(within(li).getByRole('button', { name: /reopen/i })).toBeInTheDocument()
  })

  it('Reopen button disappears after clicking it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Flip test', 'Billing')
    const li = screen.getByText('Flip test').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /mark addressed/i }))
    await u.click(within(li).getByRole('button', { name: /reopen/i }))
    expect(within(li).queryByRole('button', { name: /reopen/i })).not.toBeInTheDocument()
    expect(within(li).getByRole('button', { name: /mark addressed/i })).toBeInTheDocument()
  })

  it('screen name is shown alongside the note', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Layout off', 'Onboarding')
    expect(screen.getByText('Layout off')).toBeInTheDocument()
    expect(screen.getByText('Onboarding')).toBeInTheDocument()
  })

  it('theme toggled twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('multiple items can be individually addressed without affecting others', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Keep open', 'P1')
    await addFeedback(u, 'Close this', 'P2')
    const li2 = screen.getByText('Close this').closest('li') as HTMLElement
    await u.click(within(li2).getByRole('button', { name: /mark addressed/i }))
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    const li1 = screen.getByText('Keep open').closest('li') as HTMLElement
    expect(within(li1).getByText('Open')).toBeInTheDocument()
  })
})
