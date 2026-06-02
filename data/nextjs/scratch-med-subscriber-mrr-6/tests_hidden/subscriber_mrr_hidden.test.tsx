// HELD-OUT generalization tests — fresh sequences, edge cases, cross-view paths
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addSub(u: U, name: string, planPattern?: RegExp) {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  if (planPattern) {
    await u.selectOptions(screen.getByLabelText('Plan'), screen.getByRole('option', { name: planPattern }))
  }
  await u.click(screen.getByRole('button', { name: /add subscriber/i }))
}

describe('Subscriber MRR Tracker (held-out)', () => {
  it('deactivating all subscribers shows MRR 0 on dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    const names = ['Alice', 'Bob', 'Carol']
    for (const name of names) {
      const li = screen.getByText(name).closest('li')!
      await u.click(within(li as HTMLElement).getByRole('button', { name: /deactivate/i }))
    }
    await nav(u, 'Dashboard')
    expect(screen.getByText('MRR: $0')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 0')).toBeInTheDocument()
    expect(screen.getByText('Inactive: 3')).toBeInTheDocument()
  })

  it('reactivating changes MRR back correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    const carolLi = screen.getByText('Carol').closest('li')!
    await u.click(within(carolLi as HTMLElement).getByRole('button', { name: /deactivate/i }))
    await u.click(within(carolLi as HTMLElement).getByRole('button', { name: /^activate$/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('MRR: $257')).toBeInTheDocument()
  })

  it('adding a Growth subscriber increases MRR by 79', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Henry', /growth/i)
    await nav(u, 'Dashboard')
    expect(screen.getByText('MRR: $336')).toBeInTheDocument()
  })

  it('adding a Starter subscriber increases MRR by 29', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Irene', /starter/i)
    await nav(u, 'Dashboard')
    expect(screen.getByText('MRR: $286')).toBeInTheDocument()
  })

  it('total count includes both active and inactive on Subscribers view', async () => {
    const u = userEvent.setup()
    render(<App />)
    const bobLi = screen.getByText('Bob').closest('li')!
    await u.click(within(bobLi as HTMLElement).getByRole('button', { name: /deactivate/i }))
    await addSub(u, 'Jack', /pro/i)
    expect(screen.getByText('Active: 3 | Total: 4')).toBeInTheDocument()
  })

  it('plan labels shown correctly for each seed subscriber', () => {
    render(<App />)
    const bobLi = screen.getByText('Bob').closest('li')!
    expect(within(bobLi as HTMLElement).getByText('Starter')).toBeInTheDocument()
    expect(within(bobLi as HTMLElement).getByText('$29')).toBeInTheDocument()
    const carolLi = screen.getByText('Carol').closest('li')!
    expect(within(carolLi as HTMLElement).getByText('Growth')).toBeInTheDocument()
    expect(within(carolLi as HTMLElement).getByText('$79')).toBeInTheDocument()
  })

  it('unhiding inactive after hiding restores subscribers in list', async () => {
    const u = userEvent.setup()
    render(<App />)
    const aliceLi = screen.getByText('Alice').closest('li')!
    await u.click(within(aliceLi as HTMLElement).getByRole('button', { name: /deactivate/i }))
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide inactive/i)) // hide
    await u.click(screen.getByLabelText(/hide inactive/i)) // show again
    await nav(u, 'Subscribers')
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('dashboard inactive count updates when two subscribers deactivated', async () => {
    const u = userEvent.setup()
    render(<App />)
    const aliceLi = screen.getByText('Alice').closest('li')!
    const bobLi = screen.getByText('Bob').closest('li')!
    await u.click(within(aliceLi as HTMLElement).getByRole('button', { name: /deactivate/i }))
    await u.click(within(bobLi as HTMLElement).getByRole('button', { name: /deactivate/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Inactive: 2')).toBeInTheDocument()
    expect(screen.getByText('Active subscribers: 1')).toBeInTheDocument()
    expect(screen.getByText('MRR: $79')).toBeInTheDocument()
  })

  it('theme persists when navigating from settings to subscribers to dashboard', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Subscribers')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('multiple adds accumulate on total count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addSub(u, 'Kim', /starter/i)
    await addSub(u, 'Leo', /pro/i)
    expect(screen.getByText('Active: 5 | Total: 5')).toBeInTheDocument()
  })
})
