import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Experiment Log (held-out)', () => {
  it('choosing winner A on a new experiment is reflected in Stats win rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Mark Checkout flow done with winner A (both seeded done exps will be A)
    const li = screen.getByText('Checkout flow').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Mark done' }))
    await u.click(within(li).getByRole('button', { name: 'Winner: A' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Win rate (A): 100%')).toBeInTheDocument()
    expect(screen.getByText('Win rate (B): 0%')).toBeInTheDocument()
  })

  it('filter count updates after adding experiments while filter is Running', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Running')
    expect(screen.getByRole('heading', { name: 'Experiments (1)' })).toBeInTheDocument()
    await u.type(screen.getByLabelText('Experiment name'), 'Extra runner')
    await u.click(screen.getByRole('button', { name: 'Add experiment' }))
    expect(screen.getByRole('heading', { name: 'Experiments (2)' })).toBeInTheDocument()
    expect(screen.getByText('Extra runner')).toBeInTheDocument()
  })

  it('marking done removes experiment from Running filter view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Running')
    const li = screen.getByText('Checkout flow').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Mark done' }))
    await u.click(within(li).getByRole('button', { name: 'Winner: A' }))
    expect(screen.queryByText('Checkout flow')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Experiments (0)' })).toBeInTheDocument()
  })

  it('marking done adds experiment to Done filter view', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Checkout flow').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Mark done' }))
    await u.click(within(li).getByRole('button', { name: 'Winner: B' }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Done')
    expect(screen.getByText('Checkout flow')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Experiments (2)' })).toBeInTheDocument()
  })

  it('Stats running count decrements after marking done', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Checkout flow').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Mark done' }))
    await u.click(within(li).getByRole('button', { name: 'Winner: B' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Running: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
  })

  it('win rate rounds correctly for 1 of 3 done with winner A', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Add two more experiments and mark them done with B
    for (const nm of ['Test X', 'Test Y']) {
      await u.clear(screen.getByLabelText('Experiment name'))
      await u.type(screen.getByLabelText('Experiment name'), nm)
      await u.click(screen.getByRole('button', { name: 'Add experiment' }))
      const li = screen.getByText(nm).closest('li') as HTMLElement
      await u.click(within(li).getByRole('button', { name: 'Mark done' }))
      await u.click(within(li).getByRole('button', { name: 'Winner: B' }))
    }
    // Now done = 3 (Homepage hero=A, Test X=B, Test Y=B)
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 3')).toBeInTheDocument()
    expect(screen.getByText('Win rate (A): 33%')).toBeInTheDocument()
    expect(screen.getByText('Win rate (B): 67%')).toBeInTheDocument()
  })

  it('theme toggle twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('Stats total increases correctly after adding two more experiments', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (const nm of ['Alpha', 'Beta']) {
      await u.clear(screen.getByLabelText('Experiment name'))
      await u.type(screen.getByLabelText('Experiment name'), nm)
      await u.click(screen.getByRole('button', { name: 'Add experiment' }))
    }
    await nav(u, 'Stats')
    expect(screen.getByText('Total experiments: 4')).toBeInTheDocument()
    expect(screen.getByText('Running: 3')).toBeInTheDocument()
  })
})
