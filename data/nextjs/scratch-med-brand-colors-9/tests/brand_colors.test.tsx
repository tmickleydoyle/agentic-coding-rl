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
  it('starts on the Colors view with the Brand Colors heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Brand Colors' })).toBeInTheDocument()
  })

  it('shows the two seeded colors on load', () => {
    render(<App />)
    expect(screen.getByText('Midnight Blue')).toBeInTheDocument()
    expect(screen.getByText('#003366')).toBeInTheDocument()
    expect(screen.getByText('Coral')).toBeInTheDocument()
    expect(screen.getByText('#FF6B6B')).toBeInTheDocument()
  })

  it('shows Total colors: 2 on load', () => {
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
    expect(screen.getByRole('heading', { name: 'Color Stats' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Colors view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Colors')
    expect(screen.getByRole('heading', { name: 'Brand Colors' })).toBeInTheDocument()
  })

  it('adds a new color and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Ocean', '#1A9EF0')
    expect(screen.getByText('Ocean')).toBeInTheDocument()
    expect(screen.getByText('#1A9EF0')).toBeInTheDocument()
    expect(screen.getByLabelText('Swatch for Ocean')).toBeInTheDocument()
  })

  it('increments Total colors after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Forest', '#228B22')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('ignores adding a color with a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/hex code/i))
    await u.type(screen.getByLabelText(/hex code/i), '#AABBCC')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('ignores adding a color with a blank hex', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/color name/i))
    await u.type(screen.getByLabelText(/color name/i), 'Ghost')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.queryByText('Ghost')).not.toBeInTheDocument()
  })

  it('ignores a hex that does not start with #', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Bad', 'AABBCC')
    expect(screen.queryByText('Bad')).not.toBeInTheDocument()
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('deletes a color from the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Coral' }))
    expect(screen.queryByText('Coral')).not.toBeInTheDocument()
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
  })

  it('Stats view shows Total colors: 2 with seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('Stats view shows correct dark hue count for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // #003366 starts with 0 (dark), #FF6B6B starts with F (light)
    expect(screen.getByText('With dark hue (starts #0–#9): 1')).toBeInTheDocument()
  })

  it('Stats view shows correct light hue count for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    // #FF6B6B starts with F (light)
    expect(screen.getByText('With light hue (starts #A–#F): 1')).toBeInTheDocument()
  })

  it('Stats view shows Most recent: Coral for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Coral')).toBeInTheDocument()
  })

  it('Stats updates Most recent after adding a color (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Goldenrod', '#DAA520')
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Goldenrod')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('Stats shows Most recent: — when list is empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all colors/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: —')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
  })

  it('Clear all colors removes everything from the Colors view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all colors/i }))
    await nav(u, 'Colors')
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
    expect(screen.queryByText('Midnight Blue')).not.toBeInTheDocument()
    expect(screen.queryByText('Coral')).not.toBeInTheDocument()
  })

  it('theme defaults to light via data-theme attribute', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Toggle theme switches to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Colors')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('colors list state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Persisted', '#123456')
    await nav(u, 'Stats')
    await nav(u, 'Colors')
    expect(screen.getByText('Persisted')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })
})
