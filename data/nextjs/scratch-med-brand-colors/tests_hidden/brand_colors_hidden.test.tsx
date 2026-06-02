// HELD-OUT generalization tests — fresh scenarios, edge cases, and cross-view paths.
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
  it('seed colors are present with correct hex values', () => {
    render(<App />)
    expect(screen.getByText('#0047AB')).toBeInTheDocument()
    expect(screen.getByText('#50C878')).toBeInTheDocument()
  })

  it('adding three colors brings total to 5', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Gold', '#FFD700')
    await addColor(u, 'Teal', '#008080')
    await addColor(u, 'Coral', '#FF6B6B')
    expect(screen.getAllByText('Total colors: 5').length).toBeGreaterThan(0)
  })

  it('Most recent updates after each add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Burgundy', '#800020')
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Burgundy')).toBeInTheDocument()
    await nav(u, 'Colors')
    await addColor(u, 'Mint', '#98FF98')
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Mint')).toBeInTheDocument()
  })

  it('deleting the most recent color updates Most recent to previous', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Indigo', '#4B0082')
    await u.click(screen.getByRole('button', { name: /delete indigo/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Most recent: Emerald')).toBeInTheDocument()
  })

  it('Colors view input fields clear after a successful add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Peach', '#FFCBA4')
    expect(screen.getByLabelText(/color name/i)).toHaveValue('')
    expect(screen.getByLabelText(/hex code/i)).toHaveValue('')
  })

  it('delete button is labeled with the color name', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /delete cobalt blue/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete emerald/i })).toBeInTheDocument()
  })

  it('Stats total stays in sync after multiple deletes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Pink', '#FFC0CB')
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 3')).toBeInTheDocument()
    await nav(u, 'Colors')
    await u.click(screen.getByRole('button', { name: /delete pink/i }))
    await u.click(screen.getByRole('button', { name: /delete emerald/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 1')).toBeInTheDocument()
  })

  it('swatch is present for a newly added color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Azure', '#F0FFFF')
    expect(screen.getByLabelText('Swatch for Azure')).toBeInTheDocument()
  })

  it('Stats view audit list shows newly added color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Olive', '#808000')
    await nav(u, 'Stats')
    const statsSection = screen.getByRole('region', { name: /stats view/i })
    expect(within(statsSection).getByText('Olive')).toBeInTheDocument()
    expect(within(statsSection).getByText('#808000')).toBeInTheDocument()
  })

  it('Stats view audit list does not show deleted color', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete cobalt blue/i }))
    await nav(u, 'Stats')
    const statsSection = screen.getByRole('region', { name: /stats view/i })
    expect(within(statsSection).queryByText('Cobalt Blue')).not.toBeInTheDocument()
  })

  it('both both fields required — blank hex still does not add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/color name/i), 'Ghost White')
    await u.click(screen.getByRole('button', { name: /add color/i }))
    expect(screen.queryByText('Ghost White')).not.toBeInTheDocument()
  })

  it('Colors view total line and Stats view total line match after operations', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addColor(u, 'Ruby', '#9B111E')
    await addColor(u, 'Sapphire', '#0F52BA')
    const colorsTotal = screen.getByText('Total colors: 4')
    expect(colorsTotal).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total colors: 4')).toBeInTheDocument()
  })

  it('theme toggle button reflects current theme on Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    const btn = screen.getByRole('button', { name: /toggle theme/i })
    expect(btn.textContent).toContain('light')
    await u.click(btn)
    expect(screen.getByRole('button', { name: /toggle theme \(current: dark\)/i })).toBeInTheDocument()
  })

  it('data-theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })
})
