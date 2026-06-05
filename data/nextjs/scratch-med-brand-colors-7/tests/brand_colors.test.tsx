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
  it('starts on the Palette view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Palette' })).toBeInTheDocument()
  })

  it('shows seed colors on initial render', () => {
    render(<App />)
    expect(screen.getByText('Midnight Blue')).toBeInTheDocument()
    expect(screen.getByText('Crimson')).toBeInTheDocument()
    expect(screen.getByText('Forest Green')).toBeInTheDocument()
  })

  it('shows seed hex codes', () => {
    render(<App />)
    expect(screen.getByText('#003153')).toBeInTheDocument()
    expect(screen.getByText('#DC143C')).toBeInTheDocument()
    expect(screen.getByText('#228B22')).toBeInTheDocument()
  })

  it('shows initial total colors count', () => {
    render(<App />)
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
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

  it('navigates back to Palette view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Palette')
    expect(screen.getByRole('heading', { name: 'Palette' })).toBeInTheDocument()
  })

  it('adds a new color and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Sunshine Yellow', '#FFD700')
    expect(screen.getByText('Sunshine Yellow')).toBeInTheDocument()
    expect(screen.getByText('#FFD700')).toBeInTheDocument()
  })

  it('updates total count after adding a color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Coral', '#FF6B6B')
    expect(screen.getByText('Total colors: 4')).toBeInTheDocument()
  })

  it('ignores add when color name is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/color name/i))
    await u.type(screen.getByLabelText(/hex code/i), '#FFFFFF')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('ignores add when hex code is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/color name/i), 'White')
    await u.clear(screen.getByLabelText(/hex code/i))
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('deletes a color by name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete crimson/i }))
    expect(screen.queryByText('Crimson')).not.toBeInTheDocument()
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('shows color swatch for each entry', () => {
    render(<App />)
    expect(screen.getByLabelText('Swatch for Midnight Blue')).toBeInTheDocument()
    expect(screen.getByLabelText('Swatch for Crimson')).toBeInTheDocument()
  })

  it('stats view shows correct total colors matching seed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('stats view shows unique hex codes count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Unique hex codes: 3')).toBeInTheDocument()
  })

  it('stats view shows most recent color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Forest Green')).toBeInTheDocument()
  })

  it('stats most recent updates after adding a color (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Sky Blue', '#87CEEB')
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Sky Blue')).toBeInTheDocument()
  })

  it('stats total colors updates after adding (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Lavender', '#E6E6FA')
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 4')).toBeInTheDocument()
  })

  it('stats shows most recent as em dash when palette is empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all colors/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: —')).toBeInTheDocument()
  })

  it('clear all colors removes everything from palette view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all colors/i }))
    await nav(u, 'Palette')
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
    expect(screen.queryByText('Midnight Blue')).not.toBeInTheDocument()
  })

  it('toggles theme and data-theme attribute changes', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Palette')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('palette state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Teal', '#008080')
    await nav(u, 'Stats')
    await nav(u, 'Palette')
    expect(screen.getByText('Teal')).toBeInTheDocument()
    expect(screen.getByText('#008080')).toBeInTheDocument()
  })

  it('unique hex codes counts distinct values case-insensitively', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Add a duplicate hex in different case
    await addColor(u, 'Dup Blue', '#003153')
    await nav(u, 'Stats')
    // Midnight Blue and Dup Blue share #003153 so unique count stays 3
    expect(screen.getByText('Unique hex codes: 3')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 4')).toBeInTheDocument()
  })
})
