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
  it('deleting the most recent color updates stats most recent', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Forest Green is seed[2], delete it, now Crimson is last
    await u.click(screen.getByRole('button', { name: /delete forest green/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Crimson')).toBeInTheDocument()
  })

  it('after clearing all, stats total is 0 and unique is 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all colors/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
    expect(screen.getByText('Unique hex codes: 0')).toBeInTheDocument()
  })

  it('can add colors after clearing all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all colors/i }))
    await nav(u, 'Palette')
    await addColor(u, 'Pure White', '#FFFFFF')
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
    expect(screen.getByText('Pure White')).toBeInTheDocument()
  })

  it('deleting a non-last color does not change most recent in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Delete Midnight Blue (first seed); Forest Green is still last
    await u.click(screen.getByRole('button', { name: /delete midnight blue/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Forest Green')).toBeInTheDocument()
  })

  it('palette total count goes to 2 after deleting one seed color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete crimson/i }))
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('toggle theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('adding multiple colors increments total each time', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Red', '#FF0000')
    await addColor(u, 'Blue', '#0000FF')
    expect(screen.getByText('Total colors: 5')).toBeInTheDocument()
  })

  it('each color entry has a swatch element', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Gold', '#FFD700')
    expect(screen.getByLabelText('Swatch for Gold')).toBeInTheDocument()
  })

  it('stats unique count reduces after deleting a unique color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete midnight blue/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Unique hex codes: 2')).toBeInTheDocument()
  })

  it('stats view total matches palette view total after operations', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Amber', '#FFBF00')
    await u.click(screen.getByRole('button', { name: /delete crimson/i }))
    // 3 seed - 1 + 1 added = 3
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })
})
