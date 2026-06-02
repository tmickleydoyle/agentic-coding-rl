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

function row(name: string): HTMLElement {
  const li = screen.getByText(name).closest('li')
  if (!li) throw new Error(`no row for ${name}`)
  return li as HTMLElement
}

describe('Experiment Log (held-out)', () => {
  it('all four win rates sum correctly with a 50-50 split', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Exp1')
    await addExp(u, 'Exp2')
    await u.click(within(row('Exp1')).getByRole('button', { name: /mark done exp1/i }))
    await u.click(within(row('Exp1')).getByRole('button', { name: /winner: a for exp1/i }))
    await u.click(within(row('Exp2')).getByRole('button', { name: /mark done exp2/i }))
    await u.click(within(row('Exp2')).getByRole('button', { name: /winner: b for exp2/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Win rate A: 50%')).toBeInTheDocument()
    expect(screen.getByText('Win rate B: 50%')).toBeInTheDocument()
  })

  it('100% win rate A when all finished experiments chose A', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Trial1')
    await addExp(u, 'Trial2')
    await u.click(within(row('Trial1')).getByRole('button', { name: /mark done trial1/i }))
    await u.click(within(row('Trial1')).getByRole('button', { name: /winner: a for trial1/i }))
    await u.click(within(row('Trial2')).getByRole('button', { name: /mark done trial2/i }))
    await u.click(within(row('Trial2')).getByRole('button', { name: /winner: a for trial2/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Win rate A: 100%')).toBeInTheDocument()
    expect(screen.getByText('Win rate B: 0%')).toBeInTheDocument()
  })

  it('Stats Running count decreases after marking done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'R1')
    await addExp(u, 'R2')
    await u.click(within(row('R1')).getByRole('button', { name: /mark done r1/i }))
    await u.click(within(row('R1')).getByRole('button', { name: /winner: b for r1/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Running: 1')).toBeInTheDocument()
    expect(screen.getByText('Finished: 1')).toBeInTheDocument()
  })

  it('filter All shows both running and done experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'ShowAll1')
    await addExp(u, 'ShowAll2')
    await u.click(within(row('ShowAll1')).getByRole('button', { name: /mark done showAll1/i }))
    await u.click(within(row('ShowAll1')).getByRole('button', { name: /winner: a for showAll1/i }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'All')
    expect(screen.getByText('ShowAll1')).toBeInTheDocument()
    expect(screen.getByText('ShowAll2')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /experiments \(2\)/i })).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Keep1')
    await addExp(u, 'Keep2')
    await u.click(within(row('Keep1')).getByRole('button', { name: /mark done keep1/i }))
    await u.click(within(row('Keep1')).getByRole('button', { name: /winner: b for keep1/i }))
    await u.selectOptions(screen.getByRole('combobox', { name: /show/i }), 'Done')
    await nav(u, 'Stats')
    await nav(u, 'Experiments')
    expect(screen.queryByText('Keep2')).not.toBeInTheDocument()
    expect(screen.getByText('Keep1')).toBeInTheDocument()
  })

  it('done experiment does not show Mark done button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'Closed')
    await u.click(within(row('Closed')).getByRole('button', { name: /mark done closed/i }))
    await u.click(within(row('Closed')).getByRole('button', { name: /winner: a for closed/i }))
    expect(within(row('Closed')).queryByRole('button', { name: /mark done closed/i })).not.toBeInTheDocument()
  })

  it('multiple experiments can be in picking-winner state independently', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addExp(u, 'IndepA')
    await addExp(u, 'IndepB')
    await u.click(within(row('IndepA')).getByRole('button', { name: /mark done indepA/i }))
    expect(within(row('IndepB')).getByRole('button', { name: /mark done indepB/i })).toBeInTheDocument()
    expect(within(row('IndepA')).getByRole('button', { name: /winner: a for indepA/i })).toBeInTheDocument()
  })

  it('theme toggle can switch back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })
})
