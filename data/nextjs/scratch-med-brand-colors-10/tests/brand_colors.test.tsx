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

  it('shows seeded colors on load', () => {
    render(<App />)
    expect(screen.getByText('Midnight Blue')).toBeInTheDocument()
    expect(screen.getByText('Coral Red')).toBeInTheDocument()
  })

  it('shows Total colors: 2 on load from seed', () => {
    render(<App />)
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('adds a new color and updates total count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Ocean Blue', '#0077B6')
    expect(screen.getByText('Ocean Blue')).toBeInTheDocument()
    expect(screen.getByText('#0077B6')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('ignores a blank color name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/hex code/i))
    await u.type(screen.getByLabelText(/hex code/i), '#AABBCC')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('ignores a blank hex code', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/color name/i))
    await u.type(screen.getByLabelText(/color name/i), 'Ghost')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('prepends # to hex if missing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Forest', '228B22')
    expect(screen.getByText('#228B22')).toBeInTheDocument()
  })

  it('deletes a color and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete midnight blue/i }))
    expect(screen.queryByText('Midnight Blue')).not.toBeInTheDocument()
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
  })

  it('shows a swatch for each color', () => {
    render(<App />)
    expect(screen.getByLabelText('Swatch for Midnight Blue')).toBeInTheDocument()
    expect(screen.getByLabelText('Swatch for Coral Red')).toBeInTheDocument()
  })

  it('Stats shows seeded total and unique hues', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
    expect(screen.getByText('Unique hues: 2')).toBeInTheDocument()
  })

  it('Stats shows most recent seeded color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Coral Red')).toBeInTheDocument()
  })

  it('Stats updates most recent after adding a color (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Sunshine', '#FFD700')
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Sunshine')).toBeInTheDocument()
  })

  it('Stats updates total after adding a color (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Lavender', '#967BB6')
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('Stats shows Most recent: — when all colors are deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete midnight blue/i }))
    await u.click(screen.getByRole('button', { name: /delete coral red/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: —')).toBeInTheDocument()
  })

  it('duplicate hex codes count as one unique hue', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Navy Copy', '#1B2A4A')
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
    expect(screen.getByText('Unique hues: 2')).toBeInTheDocument()
  })

  it('Clear all colors removes everything and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all colors/i }))
    await nav(u, 'Palette')
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
    expect(screen.queryByText('Midnight Blue')).not.toBeInTheDocument()
  })

  it('Clear all colors is reflected in Stats (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all colors/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
    expect(screen.getByText('Unique hues: 0')).toBeInTheDocument()
    expect(screen.getByText('Most recent: —')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme \(current: light\)/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Palette')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('palette state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Teal', '#008080')
    await nav(u, 'Stats')
    await nav(u, 'Palette')
    expect(screen.getByText('Teal')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })
})
