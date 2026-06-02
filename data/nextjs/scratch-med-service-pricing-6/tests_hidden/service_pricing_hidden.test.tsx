// HELD-OUT generalization tests — fresh scenarios, edge cases, and cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Service Pricing Manager (held-out)', () => {
  it('adding a service updates Summary total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Email Campaign')
    await u.type(screen.getByLabelText('Price'), '40')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total services: 4')).toBeInTheDocument()
    expect(screen.getByText('Active services: 3')).toBeInTheDocument()
  })

  it('new services start as active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Branding')
    await u.type(screen.getByLabelText('Price'), '200')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    const items = screen.getAllByRole('listitem')
    const row = items.find(li => within(li).queryByText('Branding'))!
    expect(within(row).getByRole('button', { name: 'Active' })).toBeInTheDocument()
  })

  it('toggling active service to inactive updates Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    const items = screen.getAllByRole('listitem')
    const consultation = items.find(li => within(li).queryByText('Consultation'))!
    await u.click(within(consultation).getByRole('button', { name: 'Active' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Active services: 1')).toBeInTheDocument()
    expect(screen.getByText('Inactive services: 2')).toBeInTheDocument()
  })

  it('active average updates when toggling a service inactive', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Toggle Design (120) off — only Consultation (50) remains active
    const items = screen.getAllByRole('listitem')
    const design = items.find(li => within(li).queryByText('Design'))!
    await u.click(within(design).getByRole('button', { name: 'Active' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Active average: $50.00')).toBeInTheDocument()
  })

  it('deleting a service updates Summary stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete design/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total services: 2')).toBeInTheDocument()
    expect(screen.getByText('Active services: 1')).toBeInTheDocument()
  })

  it('average price recalculates after deletion', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Remove Design (120); remaining: Consultation 50, Support 30 => avg = 40
    await u.click(screen.getByRole('button', { name: /delete design/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Average price: $40.00')).toBeInTheDocument()
  })

  it('zero price is rejected when adding a service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Freebie')
    await u.type(screen.getByLabelText('Price'), '0')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.queryByText('Freebie')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Services (3)' })).toBeInTheDocument()
  })

  it('negative price is rejected when adding a service', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Service name'), 'Refund')
    await u.type(screen.getByLabelText('Price'), '-5')
    await u.click(screen.getByRole('button', { name: /add service/i }))
    expect(screen.queryByText('Refund')).not.toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show active only' }))
    await nav(u, 'Summary')
    await nav(u, 'Services')
    expect(screen.queryByText('Support')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Services (2)' })).toBeInTheDocument()
  })

  it('Summary active average is $0.00 when all services are inactive', async () => {
    const u = userEvent.setup()
    render(<App />)
    const getItems = () => screen.getAllByRole('listitem')
    // toggle Consultation and Design off (Support already inactive)
    let items = getItems()
    await u.click(within(items.find(li => within(li).queryByText('Consultation'))!).getByRole('button', { name: 'Active' }))
    items = getItems()
    await u.click(within(items.find(li => within(li).queryByText('Design'))!).getByRole('button', { name: 'Active' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Active average: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Active services: 0')).toBeInTheDocument()
  })

  it('theme toggle twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Show active only count matches active services count from Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Show active only' }))
    const headingText = screen.getByRole('heading', { name: /^Services \(/ }).textContent
    const match = headingText?.match(/\((\d+)\)/)
    const visibleCount = match ? parseInt(match[1]) : -1
    await nav(u, 'Summary')
    const activeText = screen.getByText(/Active services:/).textContent
    const activeMatch = activeText?.match(/(\d+)$/)
    const summaryActive = activeMatch ? parseInt(activeMatch[1]) : -2
    expect(visibleCount).toBe(summaryActive)
  })
})
