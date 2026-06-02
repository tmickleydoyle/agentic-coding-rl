// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths
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
  it('input fields are cleared after adding a color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Teal', '#008080')
    expect(screen.getByLabelText(/color name/i)).toHaveValue('')
    expect(screen.getByLabelText(/hex code/i)).toHaveValue('')
  })

  it('removing one seeded color leaves the other', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove midnight blue/i }))
    expect(screen.queryByText('Midnight Blue')).not.toBeInTheDocument()
    expect(screen.getByText('Coral')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
  })

  it('Stats Total colors updates after clearing all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all colors/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
    expect(screen.getByText('Unique hues: 0')).toBeInTheDocument()
    expect(screen.getByText('Palette complete: No')).toBeInTheDocument()
  })

  it('Palette complete: Yes requires exactly 5 colors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'X1', '#111111')
    await addColor(u, 'X2', '#222222')
    await addColor(u, 'X3', '#333333')
    await nav(u, 'Stats')
    // 2 seed + 3 added = 5
    expect(screen.getByText('Palette complete: Yes')).toBeInTheDocument()
  })

  it('most recent changes after adding then removing and adding again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Lemon', '#FFF44F')
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Lemon')).toBeInTheDocument()
    await nav(u, 'Colors')
    await u.click(screen.getByRole('button', { name: /remove lemon/i }))
    await nav(u, 'Stats')
    // after removing Lemon, last is Coral (second seed)
    expect(screen.getByText('Most recent: Coral')).toBeInTheDocument()
  })

  it('add multiple colors and Stats reflects all of them', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Rose', '#FF007F')
    await addColor(u, 'Mint', '#98FF98')
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 4')).toBeInTheDocument()
    expect(screen.getByText('Unique hues: 4')).toBeInTheDocument()
    expect(screen.getByText('Most recent: Mint')).toBeInTheDocument()
  })

  it('theme toggle cycles light -> dark -> light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('swatch aria-label matches the color name exactly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Ocean Wave', '#1CA9C9')
    expect(screen.getByLabelText('Swatch for Ocean Wave')).toBeInTheDocument()
  })

  it('Colors view still shows Remove buttons after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Colors')
    expect(screen.getByRole('button', { name: /remove midnight blue/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /remove coral/i })).toBeInTheDocument()
  })
})
