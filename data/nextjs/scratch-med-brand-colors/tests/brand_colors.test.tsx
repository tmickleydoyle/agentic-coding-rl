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

  it('shows the two seed colors on load', () => {
    render(<App />)
    expect(screen.getByText('Cobalt Blue')).toBeInTheDocument()
    expect(screen.getByText('#0047AB')).toBeInTheDocument()
    expect(screen.getByText('Emerald')).toBeInTheDocument()
    expect(screen.getByText('#50C878')).toBeInTheDocument()
  })

  it('shows Total colors: 2 on load', () => {
    render(<App />)
    expect(screen.getAllByText('Total colors: 2').length).toBeGreaterThan(0)
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

  it('adds a new color and updates the total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Crimson', '#DC143C')
    expect(screen.getByText('Crimson')).toBeInTheDocument()
    expect(screen.getByText('#DC143C')).toBeInTheDocument()
    expect(screen.getAllByText('Total colors: 3').length).toBeGreaterThan(0)
  })

  it('ignores add when color name is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText(/color name/i))
    await u.type(screen.getByLabelText(/hex code/i), '#FFFFFF')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getAllByText('Total colors: 2').length).toBeGreaterThan(0)
  })

  it('ignores add when hex code is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/color name/i), 'Ghost')
    await u.clear(screen.getByLabelText(/hex code/i))
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.getAllByText('Total colors: 2').length).toBeGreaterThan(0)
  })

  it('deletes a color and updates the total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete cobalt blue/i }))
    expect(screen.queryByText('Cobalt Blue')).not.toBeInTheDocument()
    expect(screen.getAllByText('Total colors: 1').length).toBeGreaterThan(0)
  })

  it('shows a swatch for each color', () => {
    render(<App />)
    expect(screen.getByLabelText('Swatch for Cobalt Blue')).toBeInTheDocument()
    expect(screen.getByLabelText('Swatch for Emerald')).toBeInTheDocument()
  })

  it('Stats view shows Total colors matching Colors view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Saffron', '#FFA500')
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
  })

  it('Stats view shows Most recent as the last added color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Violet', '#8F00FF')
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Violet')).toBeInTheDocument()
  })

  it('Stats view shows Most recent: — with no colors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete cobalt blue/i }))
    await u.click(screen.getByRole('button', { name: /delete emerald/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: —')).toBeInTheDocument()
  })

  it('Stats view lists all colors for auditing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    const statsSection = screen.getByRole('region', { name: /stats view/i })
    expect(within(statsSection).getByText('Cobalt Blue')).toBeInTheDocument()
    expect(within(statsSection).getByText('#0047AB')).toBeInTheDocument()
    expect(within(statsSection).getByText('Emerald')).toBeInTheDocument()
    expect(within(statsSection).getByText('#50C878')).toBeInTheDocument()
  })

  it('cross-view: adding a color on Colors appears in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Tangerine', '#F28500')
    await nav(u, 'Stats')
    const statsSection = screen.getByRole('region', { name: /stats view/i })
    expect(within(statsSection).getByText('Tangerine')).toBeInTheDocument()
    expect(within(statsSection).getByText('#F28500')).toBeInTheDocument()
  })

  it('cross-view: deleting a color on Colors updates Stats total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete emerald/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Slate', '#708090')
    await nav(u, 'Stats')
    await nav(u, 'Colors')
    expect(screen.getByText('Slate')).toBeInTheDocument()
    expect(screen.getAllByText('Total colors: 3').length).toBeGreaterThan(0)
  })

  it('Settings starts with light theme', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /toggle theme \(current: light\)/i })).toBeInTheDocument()
  })

  it('toggles theme to dark and reflects it in data-theme', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('theme persists across view navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Colors')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Stats shows Total colors: 0 after deleting all colors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete cobalt blue/i }))
    await u.click(screen.getByRole('button', { name: /delete emerald/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 0')).toBeInTheDocument()
  })
})
