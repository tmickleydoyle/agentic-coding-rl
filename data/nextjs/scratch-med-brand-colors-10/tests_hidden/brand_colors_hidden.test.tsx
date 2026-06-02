// HELD-OUT generalization tests — fresh scenarios to measure generalization.
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
  it('seeded colors show correct hex codes', () => {
    render(<App />)
    expect(screen.getByText('#1B2A4A')).toBeInTheDocument()
    expect(screen.getByText('#E8503A')).toBeInTheDocument()
  })

  it('adding several colors increments total correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Red', '#FF0000')
    await addColor(u, 'Green', '#00FF00')
    await addColor(u, 'Blue', '#0000FF')
    expect(screen.getByText('Total colors: 5')).toBeInTheDocument()
  })

  it('hex without # gets # prepended and stored correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Tangerine', 'FFA500')
    expect(screen.getByText('#FFA500')).toBeInTheDocument()
  })

  it('deleting a seeded color leaves the other seeded color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete coral red/i }))
    expect(screen.getByText('Midnight Blue')).toBeInTheDocument()
    expect(screen.queryByText('Coral Red')).not.toBeInTheDocument()
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
  })

  it('Stats most recent updates after delete makes a different color last', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Violet', '#EE82EE')
    await u.click(screen.getByRole('button', { name: /delete violet/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Coral Red')).toBeInTheDocument()
  })

  it('unique hues counts correctly with three distinct hex codes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Pure White', '#FFFFFF')
    await nav(u, 'Stats')
    expect(screen.getByText('Unique hues: 3')).toBeInTheDocument()
  })

  it('unique hues handles case-insensitive duplicates', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'lower coral', '#e8503a')
    await nav(u, 'Stats')
    // #E8503A and #e8503a are same hue
    expect(screen.getByText('Unique hues: 2')).toBeInTheDocument()
  })

  it('after clear all, adding a new color shows Total colors: 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all colors/i }))
    await nav(u, 'Palette')
    await addColor(u, 'Fresh Start', '#ABCDEF')
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
  })

  it('after clear all, most recent in Stats is the newly added color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all colors/i }))
    await nav(u, 'Palette')
    await addColor(u, 'Phoenix', '#C44536')
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Phoenix')).toBeInTheDocument()
  })

  it('theme toggle button label updates after toggle', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
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

  it('swatch is rendered for a newly added color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Sapphire', '#0F52BA')
    expect(screen.getByLabelText('Swatch for Sapphire')).toBeInTheDocument()
  })

  it('Stats total colors matches palette count after multiple adds and a delete', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Alpha', '#111111')
    await addColor(u, 'Beta', '#222222')
    await u.click(screen.getByRole('button', { name: /delete alpha/i }))
    await nav(u, 'Stats')
    // started with 2 seed, added 2, deleted 1 => 3
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })
})
