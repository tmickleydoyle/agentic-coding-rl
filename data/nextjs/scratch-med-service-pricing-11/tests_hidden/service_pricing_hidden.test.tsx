import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Service Pricing (held-out)', () => {
  it('starts with all three seeded services showing Deactivate buttons', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /deactivate haircut/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /deactivate beard trim/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /deactivate hair color/i })).toBeInTheDocument()
  })

  it('initial theme is light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggle theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('adding a service updates Stats total count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Pedicure')
    await u.clear(screen.getByLabelText('Price'))
    await u.type(screen.getByLabelText('Price'), '45')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 4')).toBeInTheDocument()
    expect(screen.getByText('Active services: 4')).toBeInTheDocument()
  })

  it('Stats active average excludes all-inactive services showing $0.00', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /deactivate haircut/i }))
    await u.click(screen.getByRole('button', { name: /deactivate beard trim/i }))
    await u.click(screen.getByRole('button', { name: /deactivate hair color/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active services: 0')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 3')).toBeInTheDocument()
    expect(screen.getByText('Active average: $0.00')).toBeInTheDocument()
    // overall average still reflects all 3
    expect(screen.getByText('Average price: $40.00')).toBeInTheDocument()
  })

  it('Active only filter shows all services when unchecked again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /deactivate beard trim/i }))
    await u.click(screen.getByLabelText('Active only'))
    expect(screen.queryByText('Beard Trim')).not.toBeInTheDocument()
    await u.click(screen.getByLabelText('Active only'))
    expect(screen.getByText('Beard Trim')).toBeInTheDocument()
  })

  it('Active only filter with no inactive services still shows all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Active only'))
    expect(screen.getByText('Haircut')).toBeInTheDocument()
    expect(screen.getByText('Beard Trim')).toBeInTheDocument()
    expect(screen.getByText('Hair Color')).toBeInTheDocument()
  })

  it('Stats counts inactive services correctly after multiple deactivations', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /deactivate haircut/i }))
    await u.click(screen.getByRole('button', { name: /deactivate beard trim/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active services: 1')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 2')).toBeInTheDocument()
    // only Hair Color is active: $80.00
    expect(screen.getByText('Active average: $80.00')).toBeInTheDocument()
  })

  it('new service price is formatted with two decimals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Trim')
    await u.clear(screen.getByLabelText('Price'))
    await u.type(screen.getByLabelText('Price'), '12.5')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByText('$12.50')).toBeInTheDocument()
  })

  it('deleting all services makes Stats show zeros', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete haircut/i }))
    await u.click(screen.getByRole('button', { name: /delete beard trim/i }))
    await u.click(screen.getByRole('button', { name: /delete hair color/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 0')).toBeInTheDocument()
    expect(screen.getByText('Active services: 0')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 0')).toBeInTheDocument()
  })

  it('reactivating a service updates Stats active average', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /deactivate haircut/i }))
    await u.click(screen.getByRole('button', { name: /activate haircut/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active services: 3')).toBeInTheDocument()
    expect(screen.getByText('Active average: $40.00')).toBeInTheDocument()
  })
})
