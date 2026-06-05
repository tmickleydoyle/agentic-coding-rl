// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addColor(u: U, name: string, hex: string) {
  await u.clear(screen.getByLabelText(/color name/i))
  await u.type(screen.getByLabelText(/color name/i), name)
  await u.clear(screen.getByLabelText(/hex code/i))
  await u.type(screen.getByLabelText(/hex code/i), hex)
  await u.click(screen.getByRole('button', { name: /add color/i }))
}

describe('Brand Color Manager (held-out)', () => {
  it('deletes all seeded colors and then Stats shows no colors message', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete midnight blue/i }))
    await u.click(screen.getByRole('button', { name: /delete coral/i }))
    await u.click(screen.getByRole('button', { name: /delete mint/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('No colors added yet.')).toBeInTheDocument()
    expect(screen.queryByText(/total colors/i)).not.toBeInTheDocument()
  })

  it('adds color after deleting one, total is correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete coral/i }))
    await addColor(u, 'Sapphire', '#0F52BA')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
    expect(screen.getByText('Unique hex codes: 3')).toBeInTheDocument()
  })

  it('unique hex codes counts duplicates only once even with three entries sharing a hex', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Red A', '#FF0000')
    await addColor(u, 'Red B', '#FF0000')
    await addColor(u, 'Red C', '#FF0000')
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 6')).toBeInTheDocument()
    expect(screen.getByText('Unique hex codes: 4')).toBeInTheDocument()
  })

  it('toggles theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('filter short hex toggle off re-shows the hidden entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Teal Short', '#0ff')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/filter short hex/i))
    await nav(u, 'Colors')
    expect(screen.queryByText('Teal Short')).not.toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/filter short hex/i))
    await nav(u, 'Colors')
    expect(screen.getByText('Teal Short')).toBeInTheDocument()
  })

  it('swatch div exists for each visible color', () => {
    render(<App />)
    expect(screen.getByLabelText('Swatch for Midnight Blue')).toBeInTheDocument()
    expect(screen.getByLabelText('Swatch for Coral')).toBeInTheDocument()
    expect(screen.getByLabelText('Swatch for Mint')).toBeInTheDocument()
  })

  it('swatch has the correct background color', () => {
    render(<App />)
    const swatch = screen.getByLabelText('Swatch for Midnight Blue')
    expect(swatch).toHaveStyle({ background: '#003153' })
  })

  it('Stats reflects multiple additions and deletions accurately', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Gold', '#FFD700')
    await addColor(u, 'Silver', '#C0C0C0')
    await u.click(screen.getByRole('button', { name: /delete mint/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 4')).toBeInTheDocument()
    expect(screen.getByText('Unique hex codes: 4')).toBeInTheDocument()
  })

  it('duplicate color names are both shown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Coral', '#FF6B6B')
    const corals = screen.getAllByText('Coral')
    expect(corals.length).toBeGreaterThanOrEqual(2)
  })

  it('Colors view Total colors counts all including filter-hidden', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Wht', '#fff')
    await addColor(u, 'Blk', '#000')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/filter short hex/i))
    await nav(u, 'Colors')
    // 3 seeded + 2 new = 5, both new are short hex (4 chars), both hidden
    expect(screen.getByText('Total colors: 5')).toBeInTheDocument()
    expect(screen.queryByText('Wht')).not.toBeInTheDocument()
    expect(screen.queryByText('Blk')).not.toBeInTheDocument()
  })
})
