import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Service Pricing Manager', () => {
  it('starts on the Services view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /services \(3\)/i })).toBeInTheDocument()
    expect(screen.getByText('Haircut')).toBeInTheDocument()
    expect(screen.getByText('Beard Trim')).toBeInTheDocument()
    expect(screen.getByText('Hair Color')).toBeInTheDocument()
  })

  it('shows seeded prices formatted as dollars', () => {
    render(<App />)
    expect(screen.getByText('$25.00')).toBeInTheDocument()
    expect(screen.getByText('$15.00')).toBeInTheDocument()
    expect(screen.getByText('$80.00')).toBeInTheDocument()
  })

  it('navigates to Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Services from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Services')
    expect(screen.getByRole('heading', { name: /services/i })).toBeInTheDocument()
  })

  it('adds a new service and updates the heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Shave')
    await u.clear(screen.getByLabelText('Price'))
    await u.type(screen.getByLabelText('Price'), '20')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByRole('heading', { name: /services \(4\)/i })).toBeInTheDocument()
    expect(screen.getByText('Shave')).toBeInTheDocument()
    expect(screen.getByText('$20.00')).toBeInTheDocument()
  })

  it('ignores a blank service name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Service name'))
    await u.clear(screen.getByLabelText('Price'))
    await u.type(screen.getByLabelText('Price'), '10')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByRole('heading', { name: /services \(3\)/i })).toBeInTheDocument()
  })

  it('ignores a zero or negative price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Free thing')
    await u.clear(screen.getByLabelText('Price'))
    await u.type(screen.getByLabelText('Price'), '0')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.getByRole('heading', { name: /services \(3\)/i })).toBeInTheDocument()
  })

  it('deactivates a service and shows the Activate button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /deactivate haircut/i }))
    expect(screen.getByRole('button', { name: /activate haircut/i })).toBeInTheDocument()
  })

  it('reactivates a service after deactivation', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /deactivate haircut/i }))
    await u.click(screen.getByRole('button', { name: /activate haircut/i }))
    expect(screen.getByRole('button', { name: /deactivate haircut/i })).toBeInTheDocument()
  })

  it('deletes a service and decrements the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete beard trim/i }))
    expect(screen.queryByText('Beard Trim')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /services \(2\)/i })).toBeInTheDocument()
  })

  it('Active only filter hides inactive services in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /deactivate haircut/i }))
    await u.click(screen.getByLabelText('Active only'))
    expect(screen.queryByText('Haircut')).not.toBeInTheDocument()
    expect(screen.getByText('Beard Trim')).toBeInTheDocument()
  })

  it('Active only filter does not change the heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /deactivate haircut/i }))
    await u.click(screen.getByLabelText('Active only'))
    expect(screen.getByRole('heading', { name: /services \(3\)/i })).toBeInTheDocument()
  })

  it('Stats shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 3')).toBeInTheDocument()
    expect(screen.getByText('Active services: 3')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 0')).toBeInTheDocument()
  })

  it('Stats shows correct average price for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // (25 + 15 + 80) / 3 = 40.00
    expect(screen.getByText('Average price: $40.00')).toBeInTheDocument()
    expect(screen.getByText('Active average: $40.00')).toBeInTheDocument()
  })

  it('Stats reflects deactivated service cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /deactivate haircut/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Active services: 2')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 1')).toBeInTheDocument()
    // Average price still uses all 3: (25+15+80)/3 = 40.00
    expect(screen.getByText('Average price: $40.00')).toBeInTheDocument()
    // Active average: (15+80)/2 = 47.50
    expect(screen.getByText('Active average: $47.50')).toBeInTheDocument()
  })

  it('Stats shows $0.00 averages when all services deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete haircut/i }))
    await u.click(screen.getByRole('button', { name: /delete beard trim/i }))
    await u.click(screen.getByRole('button', { name: /delete hair color/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 0')).toBeInTheDocument()
    expect(screen.getByText('Average price: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Active average: $0.00')).toBeInTheDocument()
  })

  it('Stats counts a deleted service as gone', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete hair color/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total services: 2')).toBeInTheDocument()
    // (25 + 15) / 2 = 20.00
    expect(screen.getByText('Average price: $20.00')).toBeInTheDocument()
  })

  it('toggles theme to dark via Settings', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Services')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('services state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Wax')
    await u.clear(screen.getByLabelText('Price'))
    await u.type(screen.getByLabelText('Price'), '35')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    await nav(u, 'Stats')
    await nav(u, 'Services')
    expect(screen.getByText('Wax')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /services \(4\)/i })).toBeInTheDocument()
  })
})
