// HELD-OUT generalization tests — not seen during development.
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
  it('adds multiple colors and total reflects all of them', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Sky', '#87CEEB')
    await addColor(u, 'Lime', '#00FF00')
    expect(screen.getByText('Total colors: 4')).toBeInTheDocument()
  })

  it('Stats updates light hue count when a light hex is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    // seed already has 1 light (#FF6B6B)
    await addColor(u, 'Amber', '#FFBF00')
    await nav(u, 'Stats')
    expect(screen.getByText('With light hue (starts #A–#F): 2')).toBeInTheDocument()
  })

  it('Stats updates dark hue count when a dark hex is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    // seed already has 1 dark (#003366)
    await addColor(u, 'Ink', '#111111')
    await nav(u, 'Stats')
    expect(screen.getByText('With dark hue (starts #0–#9): 2')).toBeInTheDocument()
  })

  it('deleting the most recent color updates Stats Most recent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Temporary', '#ABCDEF')
    // now delete Temporary
    await u.click(screen.getByRole('button', { name: 'Delete Temporary' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Coral')).toBeInTheDocument()
  })

  it('swatch for newly added color has correct aria-label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Sapphire', '#0F52BA')
    expect(screen.getByLabelText('Swatch for Sapphire')).toBeInTheDocument()
  })

  it('clearing all and then adding a color shows Total colors: 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all colors/i }))
    await nav(u, 'Colors')
    await addColor(u, 'Solo', '#AABBCC')
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
  })

  it('Stats shows 0 for both hue counts after clearing all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all colors/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('With light hue (starts #A–#F): 0')).toBeInTheDocument()
    expect(screen.getByText('With dark hue (starts #0–#9): 0')).toBeInTheDocument()
  })

  it('hex code starting with a lowercase letter is counted as light hue', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'LowerCase', '#abc123')
    await nav(u, 'Stats')
    // #abc123 starts with a (light)
    expect(screen.getByText('With light hue (starts #A–#F): 2')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('deleting a color decrements total in Colors view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Midnight Blue' }))
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
  })
})
