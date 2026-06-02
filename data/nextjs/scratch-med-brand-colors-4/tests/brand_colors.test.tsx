import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addColor(u: U, name: string, hex: string) {
  await u.clear(screen.getByLabelText('Color name'))
  await u.type(screen.getByLabelText('Color name'), name)
  await u.clear(screen.getByLabelText('Hex code'))
  await u.type(screen.getByLabelText('Hex code'), hex)
  await u.click(screen.getByRole('button', { name: /add color/i }))
}

describe('Brand Color Manager', () => {
  it('starts on the Colors view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Colors' })).toBeInTheDocument()
  })

  it('shows No colors yet when no colors have been added', () => {
    render(<App />)
    expect(screen.getByText('No colors yet')).toBeInTheDocument()
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

  it('adds a color and updates the total count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Ocean Blue', '#1A2B3C')
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
    expect(screen.queryByText('No colors yet')).not.toBeInTheDocument()
  })

  it('displays the color name in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Sunset Red', '#FF4500')
    expect(screen.getByText('Sunset Red')).toBeInTheDocument()
  })

  it('displays the hex code in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Sunset Red', '#FF4500')
    expect(screen.getByText('#FF4500')).toBeInTheDocument()
  })

  it('renders a swatch with the correct aria-label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Forest Green', '#228B22')
    expect(screen.getByLabelText('Swatch for Forest Green')).toBeInTheDocument()
  })

  it('ignores blank name submission', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Hex code'), '#123456')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
    expect(screen.getByText('No colors yet')).toBeInTheDocument()
  })

  it('ignores blank hex submission', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Color name'), 'Ghost')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
  })

  it('deletes a color and updates count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Purple Rain', '#9B30FF')
    await addColor(u, 'Gold Leaf', '#DAA520')
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Delete Purple Rain' }))
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
    expect(screen.queryByText('Purple Rain')).not.toBeInTheDocument()
    expect(screen.getByText('Gold Leaf')).toBeInTheDocument()
  })

  it('shows No colors yet after all colors are deleted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Solo', '#AABBCC')
    await u.click(screen.getByRole('button', { name: 'Delete Solo' }))
    expect(screen.getByText('No colors yet')).toBeInTheDocument()
  })

  it('Stats view shows Total colors: 0 initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
  })

  it('Stats view reflects colors added in Colors view (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Sky', '#87CEEB')
    await addColor(u, 'Navy', '#000080')
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 2')).toBeInTheDocument()
  })

  it('Stats view shows correct unique hex codes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Alpha', '#FFFFFF')
    await addColor(u, 'Beta', '#ffffff')
    await addColor(u, 'Gamma', '#000000')
    await nav(u, 'Stats')
    expect(screen.getByText('Unique hex codes: 2')).toBeInTheDocument()
  })

  it('Stats view shows Most recent: — when no colors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: —')).toBeInTheDocument()
  })

  it('Stats view shows Most recent with the last added color name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'First', '#111111')
    await addColor(u, 'Second', '#222222')
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Second')).toBeInTheDocument()
  })

  it('Settings view shows the Toggle theme button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument()
  })

  it('Settings starts with light theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByText('Current theme: light')).toBeInTheDocument()
  })

  it('toggles theme to dark and reflects data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: 'Toggle theme' }))
    expect(screen.getByText('Current theme: dark')).toBeInTheDocument()
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists after navigating away and back', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: 'Toggle theme' }))
    await nav(u, 'Colors')
    await nav(u, 'Settings')
    expect(screen.getByText('Current theme: dark')).toBeInTheDocument()
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('colors list persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Persisted', '#ABCDEF')
    await nav(u, 'Stats')
    await nav(u, 'Colors')
    expect(screen.getByText('Persisted')).toBeInTheDocument()
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
  })
})
