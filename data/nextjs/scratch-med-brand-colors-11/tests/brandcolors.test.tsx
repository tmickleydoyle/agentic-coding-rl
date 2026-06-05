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

describe('Brand Color Manager', () => {
  it('starts on the Colors view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Colors' })).toBeInTheDocument()
  })

  it('shows seeded colors on initial load', () => {
    render(<App />)
    expect(screen.getByText('Midnight Blue')).toBeInTheDocument()
    expect(screen.getByText('#003366')).toBeInTheDocument()
    expect(screen.getByText('Coral')).toBeInTheDocument()
    expect(screen.getByText('#FF6B6B')).toBeInTheDocument()
  })

  it('shows Total colors: 2 for the seeded data', () => {
    render(<App />)
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('renders swatches for seeded colors', () => {
    render(<App />)
    expect(screen.getByLabelText('Swatch for Midnight Blue')).toBeInTheDocument()
    expect(screen.getByLabelText('Swatch for Coral')).toBeInTheDocument()
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

  it('adds a new color and updates the total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Forest Green', '#228B22')
    expect(screen.getByText('Forest Green')).toBeInTheDocument()
    expect(screen.getByText('#228B22')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('renders a swatch for a newly added color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Sunflower', '#FFD700')
    expect(screen.getByLabelText('Swatch for Sunflower')).toBeInTheDocument()
  })

  it('ignores add when color name is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/hex code/i))
    await u.type(screen.getByLabelText(/hex code/i), '#AABBCC')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('ignores add when hex code is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/color name/i))
    await u.type(screen.getByLabelText(/color name/i), 'Invisible')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('removes a color by name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove coral/i }))
    expect(screen.queryByText('Coral')).not.toBeInTheDocument()
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
  })

  it('Stats shows correct totals from seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
    expect(screen.getByText('Unique hues: 2')).toBeInTheDocument()
  })

  it('Stats shows most recent as the last added color (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Sky Blue', '#87CEEB')
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Sky Blue')).toBeInTheDocument()
  })

  it('Stats shows most recent as seeded last color when nothing added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Coral')).toBeInTheDocument()
  })

  it('Stats shows Palette complete: No with fewer than 5 colors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Palette complete: No')).toBeInTheDocument()
  })

  it('Stats shows Palette complete: Yes with 5 or more colors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'C', '#111111')
    await addColor(u, 'D', '#222222')
    await addColor(u, 'E', '#333333')
    await nav(u, 'Stats')
    expect(screen.getByText('Palette complete: Yes')).toBeInTheDocument()
  })

  it('Stats shows Most recent: — when list is empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all colors/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: —')).toBeInTheDocument()
  })

  it('Clear all colors removes everything and Colors view shows Total colors: 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all colors/i }))
    await nav(u, 'Colors')
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
    expect(screen.queryByText('Midnight Blue')).not.toBeInTheDocument()
    expect(screen.queryByText('Coral')).not.toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Colors')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back to Colors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Persisted Purple', '#800080')
    await nav(u, 'Stats')
    await nav(u, 'Colors')
    expect(screen.getByText('Persisted Purple')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('Stats Unique hues counts distinct hex values case-insensitively', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Duplicate', '#ff6b6b')
    await nav(u, 'Stats')
    expect(screen.getByText('Unique hues: 2')).toBeInTheDocument()
  })
})
