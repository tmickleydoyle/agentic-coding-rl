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

  it('shows Total colors: 0 initially', () => {
    render(<App />)
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
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

  it('navigates back to Colors view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Colors')
    expect(screen.getByRole('heading', { name: 'Colors' })).toBeInTheDocument()
  })

  it('adds a color and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Ocean Blue', '#0077FF')
    expect(screen.getByText('Ocean Blue')).toBeInTheDocument()
    expect(screen.getByText('#0077FF')).toBeInTheDocument()
  })

  it('shows the swatch with correct aria-label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Coral', '#FF6B6B')
    expect(screen.getByLabelText('Swatch for Coral')).toBeInTheDocument()
  })

  it('increments Total colors after each addition', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Red', '#FF0000')
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
    await addColor(u, 'Green', '#00FF00')
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('ignores a color with blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/hex code/i), '#123456')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
  })

  it('ignores a color with blank hex', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/color name/i), 'Ghost')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
  })

  it('ignores a hex code that does not start with #', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Bad hex', 'FFFFFF')
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
  })

  it('deletes a color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Teal', '#008080')
    expect(screen.getByText('Teal')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Delete Teal' }))
    expect(screen.queryByText('Teal')).not.toBeInTheDocument()
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
  })

  it('clears inputs after adding a color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Navy', '#001F5B')
    expect(screen.getByLabelText(/color name/i)).toHaveValue('')
    expect(screen.getByLabelText(/hex code/i)).toHaveValue('')
  })

  it('Stats shows Total colors: 0 when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
  })

  it('Stats shows Most recent: — when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: —')).toBeInTheDocument()
  })

  it('Stats reflects added colors (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Indigo', '#4B0082')
    await addColor(u, 'Gold', '#FFD700')
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
    expect(screen.getByText('Most recent: Gold')).toBeInTheDocument()
  })

  it('Stats counts unique hex codes correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Primary Red', '#FF0000')
    await addColor(u, 'Error Red', '#FF0000')
    await addColor(u, 'Blue', '#0000FF')
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
    expect(screen.getByText('Unique hex codes: 2')).toBeInTheDocument()
  })

  it('Stats updates after a color is deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Pink', '#FFC0CB')
    await addColor(u, 'Black', '#000000')
    await u.click(screen.getByRole('button', { name: 'Delete Black' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
    expect(screen.getByText('Most recent: Pink')).toBeInTheDocument()
  })

  it('theme defaults to light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Colors')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('color list persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Persisted', '#ABCDEF')
    await nav(u, 'Stats')
    await nav(u, 'Colors')
    expect(screen.getByText('Persisted')).toBeInTheDocument()
    expect(screen.getByText('#ABCDEF')).toBeInTheDocument()
  })
})
