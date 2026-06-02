import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addSubscriber(u: U, name: string, planLabel?: RegExp) {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  if (planLabel) {
    await u.selectOptions(screen.getByLabelText('Plan'), screen.getByRole('option', { name: planLabel }))
  }
  await u.click(screen.getByRole('button', { name: /add subscriber/i }))
}

describe('Subscriber MRR Tracker', () => {
  it('starts on the Subscribers view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Subscribers' })).toBeInTheDocument()
  })

  it('shows seed subscribers on load', () => {
    render(<App />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('shows initial active and total counts', () => {
    render(<App />)
    expect(screen.getByText('Active: 3 | Total: 3')).toBeInTheDocument()
  })

  it('navigates to Dashboard view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Subscribers view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    await nav(u, 'Subscribers')
    expect(screen.getByRole('heading', { name: 'Subscribers' })).toBeInTheDocument()
  })

  it('dashboard shows correct initial totals for seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 3')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 3')).toBeInTheDocument()
    expect(screen.getByText('MRR: $257')).toBeInTheDocument()
    expect(screen.getByText('Inactive: 0')).toBeInTheDocument()
  })

  it('adds a new subscriber and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Dave', /starter/i)
    expect(screen.getByText('Dave')).toBeInTheDocument()
    expect(screen.getByText('Active: 4 | Total: 4')).toBeInTheDocument()
  })

  it('ignores blank subscriber name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add subscriber/i }))
    expect(screen.getByText('Active: 3 | Total: 3')).toBeInTheDocument()
  })

  it('new subscriber is active by default with Deactivate button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Eve', /growth/i)
    const li = screen.getByText('Eve').closest('li')!
    expect(within(li as HTMLElement).getByText('Active')).toBeInTheDocument()
    expect(within(li as HTMLElement).getByRole('button', { name: /deactivate/i })).toBeInTheDocument()
  })

  it('deactivating a subscriber changes status and counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    const aliceLi = screen.getByText('Alice').closest('li')!
    await u.click(within(aliceLi as HTMLElement).getByRole('button', { name: /deactivate/i }))
    expect(within(aliceLi as HTMLElement).getByText('Inactive')).toBeInTheDocument()
    expect(screen.getByText('Active: 2 | Total: 3')).toBeInTheDocument()
  })

  it('deactivate button becomes Activate after deactivating', async () => {
    const u = userEvent.setup()
    render(<App />)
    const aliceLi = screen.getByText('Alice').closest('li')!
    await u.click(within(aliceLi as HTMLElement).getByRole('button', { name: /deactivate/i }))
    expect(within(aliceLi as HTMLElement).getByRole('button', { name: /^activate$/i })).toBeInTheDocument()
  })

  it('reactivating a subscriber restores active count', async () => {
    const u = userEvent.setup()
    render(<App />)
    const aliceLi = screen.getByText('Alice').closest('li')!
    await u.click(within(aliceLi as HTMLElement).getByRole('button', { name: /deactivate/i }))
    await u.click(within(aliceLi as HTMLElement).getByRole('button', { name: /^activate$/i }))
    expect(screen.getByText('Active: 3 | Total: 3')).toBeInTheDocument()
  })

  it('dashboard MRR excludes inactive subscribers (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    const aliceLi = screen.getByText('Alice').closest('li')!
    await u.click(within(aliceLi as HTMLElement).getByRole('button', { name: /deactivate/i }))
    await nav(u, 'Dashboard')
    // Alice is Pro $149, MRR should be 29+79 = 108
    expect(screen.getByText('MRR: $108')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 2')).toBeInTheDocument()
    expect(screen.getByText('Inactive: 1')).toBeInTheDocument()
  })

  it('dashboard total subscriber count includes inactive', async () => {
    const u = userEvent.setup()
    render(<App />)
    const bobLi = screen.getByText('Bob').closest('li')!
    await u.click(within(bobLi as HTMLElement).getByRole('button', { name: /deactivate/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 3')).toBeInTheDocument()
  })

  it('shows plan short label and price in subscriber row', () => {
    render(<App />)
    const aliceLi = screen.getByText('Alice').closest('li')!
    expect(within(aliceLi as HTMLElement).getByText('Pro')).toBeInTheDocument()
    expect(within(aliceLi as HTMLElement).getByText('$149')).toBeInTheDocument()
  })

  it('toggles theme via Settings and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Subscribers')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hide inactive hides inactive subscribers from the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    const aliceLi = screen.getByText('Alice').closest('li')!
    await u.click(within(aliceLi as HTMLElement).getByRole('button', { name: /deactivate/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide inactive/i))
    await nav(u, 'Subscribers')
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('hide inactive does not affect dashboard counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    const aliceLi = screen.getByText('Alice').closest('li')!
    await u.click(within(aliceLi as HTMLElement).getByRole('button', { name: /deactivate/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide inactive/i))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total subscribers: 3')).toBeInTheDocument()
    expect(screen.getByText('Inactive: 1')).toBeInTheDocument()
  })

  it('subscriber state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Frank', /pro/i)
    await nav(u, 'Dashboard')
    await nav(u, 'Subscribers')
    expect(screen.getByText('Frank')).toBeInTheDocument()
    expect(screen.getByText('Active: 4 | Total: 4')).toBeInTheDocument()
  })

  it('MRR increases when a new Pro subscriber is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSubscriber(u, 'Grace', /pro/i)
    await nav(u, 'Dashboard')
    // seed MRR=257, plus Pro=149 => 406
    expect(screen.getByText('MRR: $406')).toBeInTheDocument()
  })
})
