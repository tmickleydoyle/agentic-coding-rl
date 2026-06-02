import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeature(
  u: U,
  title: string,
  priority: string = 'P1',
  status: string = 'idea',
) {
  await u.clear(screen.getByLabelText(/feature title/i))
  await u.type(screen.getByLabelText(/feature title/i), title)
  await u.selectOptions(screen.getByLabelText(/^priority$/i), priority)
  await u.selectOptions(screen.getByLabelText(/^status$/i), status)
  await u.click(screen.getByRole('button', { name: /add feature/i }))
}

describe('Feature Backlog hidden tests', () => {
  it('filter by P1 hides P0 and P2 items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Zero', 'P0', 'idea')
    await addFeature(u, 'One', 'P1', 'idea')
    await addFeature(u, 'Two', 'P2', 'idea')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P1')
    expect(screen.getByRole('heading', { name: 'Features (1)' })).toBeInTheDocument()
    expect(screen.queryByText('Zero')).not.toBeInTheDocument()
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(screen.queryByText('Two')).not.toBeInTheDocument()
  })

  it('filter P2 shows correct count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Stretch 1', 'P2', 'idea')
    await addFeature(u, 'Stretch 2', 'P2', 'building')
    await addFeature(u, 'Critical', 'P0', 'shipped')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P2')
    expect(screen.getByRole('heading', { name: 'Features (2)' })).toBeInTheDocument()
  })

  it('Stats Completion 100% when all shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Ship A', 'P0', 'shipped')
    await addFeature(u, 'Ship B', 'P1', 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })

  it('Stats shows Shipped: 0 when no features are shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'In progress', 'P1', 'building')
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('adding a shipped feature increases Shipped count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Feature X', 'P0', 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 1')).toBeInTheDocument()
    expect(screen.getByText('P0: 1')).toBeInTheDocument()
  })

  it('deleting one of many features updates heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Keep A', 'P1', 'idea')
    await addFeature(u, 'Keep B', 'P1', 'idea')
    await addFeature(u, 'Remove', 'P1', 'idea')
    expect(screen.getByRole('heading', { name: 'Features (3)' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete remove/i }))
    expect(screen.getByRole('heading', { name: 'Features (2)' })).toBeInTheDocument()
  })

  it('filter active then delete item — count reflects remaining visible', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'P0 item', 'P0', 'idea')
    await addFeature(u, 'P0 other', 'P0', 'building')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    expect(screen.getByRole('heading', { name: 'Features (2)' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete p0 item/i }))
    expect(screen.getByRole('heading', { name: 'Features (1)' })).toBeInTheDocument()
  })

  it('Stats P0 count updates after deleting a P0 feature', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'P0 del', 'P0', 'idea')
    await addFeature(u, 'P0 keep', 'P0', 'idea')
    await u.click(screen.getByRole('button', { name: /delete p0 del/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('P0: 1')).toBeInTheDocument()
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
  })

  it('theme toggles back to light on second click', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('feature with status building shows in list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'In progress feature', 'P1', 'building')
    const li = screen.getByText('In progress feature').closest('li') as HTMLElement
    expect(within(li).getByText('building')).toBeInTheDocument()
    expect(within(li).getByText('P1')).toBeInTheDocument()
  })

  it('Stats view shows all priority counts correctly after many adds', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'A', 'P0', 'shipped')
    await addFeature(u, 'B', 'P0', 'idea')
    await addFeature(u, 'C', 'P1', 'building')
    await addFeature(u, 'D', 'P2', 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('P0: 2')).toBeInTheDocument()
    expect(screen.getByText('P1: 1')).toBeInTheDocument()
    expect(screen.getByText('P2: 1')).toBeInTheDocument()
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })
})
