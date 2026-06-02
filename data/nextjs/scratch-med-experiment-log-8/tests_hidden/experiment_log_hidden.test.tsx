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

describe('A/B Experiment Log (held-out)', () => {
  it('heading count updates as experiments are added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Alpha')
    expect(screen.getByRole('heading', { name: 'Experiments (1)' })).toBeInTheDocument()
    await addExp(u, 'Beta')
    expect(screen.getByRole('heading', { name: 'Experiments (2)' })).toBeInTheDocument()
    await addExp(u, 'Gamma')
    expect(screen.getByRole('heading', { name: 'Experiments (3)' })).toBeInTheDocument()
  })

  it('done experiment no longer shows Mark done button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Conclude Me')
    await u.click(screen.getByRole('button', { name: /mark done/i }))
    await u.click(screen.getByRole('button', { name: 'Winner: B' }))
    expect(screen.queryByRole('button', { name: /mark done/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Winner: A' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Winner: B' })).not.toBeInTheDocument()
  })

  it('Stats Running count decreases when experiment is finished', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Nav Redesign')
    await addExp(u, 'Footer Copy')
    await nav(u, 'Stats')
    expect(screen.getByText('Running: 2')).toBeInTheDocument()
    await nav(u, 'Experiments')
    await u.click(screen.getAllByRole('button', { name: /mark done/i })[0])
    await u.click(screen.getByRole('button', { name: 'Winner: A' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Running: 1')).toBeInTheDocument()
    expect(screen.getByText('Finished: 1')).toBeInTheDocument()
  })

  it('Win rate B is 100% when all finished chose B', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Test One')
    await addExp(u, 'Test Two')
    await u.click(screen.getAllByRole('button', { name: /mark done/i })[0])
    await u.click(screen.getByRole('button', { name: 'Winner: B' }))
    await u.click(screen.getAllByRole('button', { name: /mark done/i })[0])
    await u.click(screen.getByRole('button', { name: 'Winner: B' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Win rate A: 0%')).toBeInTheDocument()
    expect(screen.getByText('Win rate B: 100%')).toBeInTheDocument()
  })

  it('Done filter count reflects only finished experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'R1')
    await addExp(u, 'R2')
    await addExp(u, 'D1')
    await u.click(screen.getAllByRole('button', { name: /mark done/i })[2])
    await u.click(screen.getByRole('button', { name: 'Winner: A' }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Done')
    expect(screen.getByRole('heading', { name: 'Experiments (1)' })).toBeInTheDocument()
  })

  it('switching theme to dark and back to light works', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Running filter count updates correctly after marking done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Exp A')
    await addExp(u, 'Exp B')
    await addExp(u, 'Exp C')
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    expect(screen.getByRole('heading', { name: 'Experiments (3)' })).toBeInTheDocument()
    await u.click(screen.getAllByRole('button', { name: /mark done/i })[0])
    await u.click(screen.getByRole('button', { name: 'Winner: A' }))
    expect(screen.getByRole('heading', { name: 'Experiments (2)' })).toBeInTheDocument()
  })

  it('Stats total counts experiments regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Visible')
    await addExp(u, 'Hidden by Filter')
    await u.click(screen.getAllByRole('button', { name: /mark done/i })[1])
    await u.click(screen.getByRole('button', { name: 'Winner: B' }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Running')
    // filter shows only 1, but stats should still show total 2
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Finished: 1')).toBeInTheDocument()
    expect(screen.getByText('Running: 1')).toBeInTheDocument()
  })
})
