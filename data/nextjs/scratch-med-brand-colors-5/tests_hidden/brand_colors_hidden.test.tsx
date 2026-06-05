// HELD-OUT generalization tests — fresh scenarios to measure real understanding.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addColor(u: U, name: string, hex: string) {
  await u.clear(screen.getByLabelText('Color name'))
  await u.type(screen.getByLabelText('Color name'), name)
  await u.clear(screen.getByLabelText('Hex code'))
  await u.type(screen.getByLabelText('Hex code'), hex)
  await u.click(screen.getByRole('button', { name: /add color/i }))
}

describe('Brand Color Manager (held-out)', () => {
  it('seed has the correct three hex codes visible', () => {
    render(<App />)
    expect(screen.getByText('#0057ff')).toBeInTheDocument()
    expect(screen.getByText('#ff5700')).toBeInTheDocument()
    expect(screen.getByText('#f0f0f0')).toBeInTheDocument()
  })

  it('adding two more colors shows Total colors: 5', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Gold', '#ffd700')
    await addColor(u, 'Navy', '#001f54')
    expect(screen.getByText('Total colors: 5')).toBeInTheDocument()
  })

  it('removing all seed colors shows Total colors: 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Primary' }))
    await u.click(screen.getByRole('button', { name: 'Remove Secondary' }))
    await u.click(screen.getByRole('button', { name: 'Remove Neutral' }))
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
  })

  it('filter by partial lowercase hex is not listed (filter is by name only)', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Type something that matches no name but would match a hex
    await u.type(screen.getByLabelText('Filter colors'), '0057')
    expect(screen.queryByText('Primary')).not.toBeInTheDocument()
    // Total count is still 3 regardless
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('filter neutral by uppercase letters', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter colors'), 'NEUTRAL')
    expect(screen.getByText('Neutral')).toBeInTheDocument()
    expect(screen.queryByText('Primary')).not.toBeInTheDocument()
  })

  it('clearing filter restores all colors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Filter colors'), 'primary')
    expect(screen.queryByText('Secondary')).not.toBeInTheDocument()
    await u.clear(screen.getByLabelText('Filter colors'))
    expect(screen.getByText('Secondary')).toBeInTheDocument()
    expect(screen.getByText('Neutral')).toBeInTheDocument()
  })

  it('hex without # is rejected, count stays at 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'BadColor', 'aabbcc')
    expect(screen.queryByText('BadColor')).not.toBeInTheDocument()
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('Stats shows Unique hues: 1 when all colors share the same hex', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Primary' }))
    await u.click(screen.getByRole('button', { name: 'Remove Secondary' }))
    await u.click(screen.getByRole('button', { name: 'Remove Neutral' }))
    await addColor(u, 'Copy1', '#abcdef')
    await addColor(u, 'Copy2', '#abcdef')
    await nav(u, 'Stats')
    expect(screen.getByText('Unique hues: 1')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('Stats most recent updates after second add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'First', '#111111')
    await addColor(u, 'Second', '#222222')
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Second')).toBeInTheDocument()
  })

  it('Stats most recent shows seed name before any additions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Neutral')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('swatch for a new color appears with correct aria-label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Crimson', '#dc143c')
    expect(screen.getByLabelText('Swatch for Crimson')).toBeInTheDocument()
  })

  it('Stats Unique hues counts all three seed hues as distinct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Unique hues: 3')).toBeInTheDocument()
  })

  it('removing a color and re-visiting Stats reflects the new total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Secondary' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
    expect(screen.getByText('Unique hues: 2')).toBeInTheDocument()
  })
})
