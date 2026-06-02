import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addExp(u: U, name: string) {
  await u.clear(screen.getByLabelText(/experiment name/i))
  await u.type(screen.getByLabelText(/experiment name/i), name)
  await u.click(screen.getByRole('button', { name: /add experiment/i }))
}

function expRow(name: string): HTMLElement {
  const li = screen.getByText(name).closest('li')
  if (!li) throw new Error(`no row for ${name}`)
  return li as HTMLElement
}

describe('Experiment Log (held-out)', () => {
  it('multiple experiments added update the All count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Test one')
    await addExp(u, 'Test two')
    await addExp(u, 'Test three')
    expect(screen.getByRole('heading', { name: 'All (3)' })).toBeInTheDocument()
  })

  it('Done filter count updates after marking an experiment done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Nav test')
    await addExp(u, 'Color test')
    await u.click(within(expRow('Nav test')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Nav test')).getByRole('button', { name: 'Winner: B' }))
    await u.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.getByRole('heading', { name: 'Done (1)' })).toBeInTheDocument()
  })

  it('Running count decrements after marking done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Footer test')
    await addExp(u, 'Header test')
    await u.click(within(expRow('Footer test')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Footer test')).getByRole('button', { name: 'Winner: A' }))
    await u.click(screen.getByRole('button', { name: 'Running' }))
    expect(screen.getByRole('heading', { name: 'Running (1)' })).toBeInTheDocument()
    expect(screen.getByText('Header test')).toBeInTheDocument()
    expect(screen.queryByText('Footer test')).not.toBeInTheDocument()
  })

  it('Stats running count updates when all experiments finish', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Solo')
    await u.click(within(expRow('Solo')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Solo')).getByRole('button', { name: 'Winner: B' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Running: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })

  it('Stats win rate B is 100 when all done experiments won by B', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'P1')
    await addExp(u, 'P2')
    await u.click(within(expRow('P1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('P1')).getByRole('button', { name: 'Winner: B' }))
    await u.click(within(expRow('P2')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('P2')).getByRole('button', { name: 'Winner: B' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Win rate (A): 0%')).toBeInTheDocument()
    expect(screen.getByText('Win rate (B): 100%')).toBeInTheDocument()
  })

  it('win rate rounds correctly for a 1-of-3 split', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'R1')
    await addExp(u, 'R2')
    await addExp(u, 'R3')
    await u.click(within(expRow('R1')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('R1')).getByRole('button', { name: 'Winner: A' }))
    await u.click(within(expRow('R2')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('R2')).getByRole('button', { name: 'Winner: B' }))
    await u.click(within(expRow('R3')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('R3')).getByRole('button', { name: 'Winner: B' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Win rate (A): 33%')).toBeInTheDocument()
    expect(screen.getByText('Win rate (B): 67%')).toBeInTheDocument()
  })

  it('done experiment does not show Mark done button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Finished exp')
    await u.click(within(expRow('Finished exp')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Finished exp')).getByRole('button', { name: 'Winner: A' }))
    expect(within(expRow('Finished exp')).queryByRole('button', { name: /mark done/i })).not.toBeInTheDocument()
  })

  it('switching filter back to All after Done shows all items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Live one')
    await addExp(u, 'Done one')
    await u.click(within(expRow('Done one')).getByRole('button', { name: /mark done/i }))
    await u.click(within(expRow('Done one')).getByRole('button', { name: 'Winner: A' }))
    await u.click(screen.getByRole('button', { name: 'Done' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByRole('heading', { name: 'All (2)' })).toBeInTheDocument()
    expect(screen.getByText('Live one')).toBeInTheDocument()
    expect(screen.getByText('Done one')).toBeInTheDocument()
  })

  it('theme toggle can go back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Stats total experiments updates after adding multiple experiments across navigations', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'First')
    await nav(u, 'Stats')
    expect(screen.getByText('Total experiments: 1')).toBeInTheDocument()
    await nav(u, 'Experiments')
    await addExp(u, 'Second')
    await nav(u, 'Stats')
    expect(screen.getByText('Total experiments: 2')).toBeInTheDocument()
  })
})
