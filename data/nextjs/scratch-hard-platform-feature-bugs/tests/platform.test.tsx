import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeature(u: U, name: string) {
  await u.clear(screen.getByLabelText(/feature name/i))
  await u.type(screen.getByLabelText(/feature name/i), name)
  await u.click(screen.getByRole('button', { name: /add feature/i }))
}

async function fileBug(u: U, feature: string, title: string, severity: string) {
  await u.selectOptions(screen.getByLabelText(/^feature$/i), feature)
  await u.clear(screen.getByLabelText(/title/i))
  await u.type(screen.getByLabelText(/title/i), title)
  await u.selectOptions(screen.getByLabelText(/severity/i), severity)
  await u.click(screen.getByRole('button', { name: /file bug/i }))
}

const quality = () => screen.getByRole('region', { name: 'Quality view' })
const bugsView = () => screen.getByRole('region', { name: 'Bugs view' })

describe('Feature quality tracker', () => {
  it('starts on Features', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Features' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Bugs')
    expect(screen.getByRole('heading', { name: 'Bugs' })).toBeInTheDocument()
    await nav(u, 'Quality')
    expect(screen.getByRole('heading', { name: 'Quality' })).toBeInTheDocument()
    await nav(u, 'Features')
    expect(screen.getByRole('heading', { name: 'Features' })).toBeInTheDocument()
  })

  it('adds a feature shown in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Search')
    expect(screen.getByText('Search')).toBeInTheDocument()
  })

  it('ignores a blank feature name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add feature/i }))
    await nav(u, 'Quality')
    expect(within(quality()).getByText(/healthiest feature: none/i)).toBeInTheDocument()
  })

  it('trims surrounding whitespace from a feature name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, '  Login  ')
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('files a bug rendered with severity, status, and feature', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Search')
    await nav(u, 'Bugs')
    await fileBug(u, 'Search', 'Slow query', 'high')
    expect(screen.getByText('Slow query [high] - open (Search)')).toBeInTheDocument()
  })

  it('ignores a bug with a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Search')
    await nav(u, 'Bugs')
    await u.selectOptions(screen.getByLabelText(/^feature$/i), 'Search')
    await u.click(screen.getByRole('button', { name: /file bug/i }))
    await nav(u, 'Quality')
    expect(within(quality()).getByText(/search: 0 open \/ 0 total/i)).toBeInTheDocument()
  })

  it('closes an open bug and removes its Close button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Search')
    await nav(u, 'Bugs')
    await fileBug(u, 'Search', 'Crash', 'low')
    await u.click(within(bugsView()).getByRole('button', { name: /close/i }))
    expect(screen.getByText('Crash [low] - closed (Search)')).toBeInTheDocument()
    expect(within(bugsView()).queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
  })

  it('counts open and total bugs per feature (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Search')
    await nav(u, 'Bugs')
    await fileBug(u, 'Search', 'A', 'low')
    await fileBug(u, 'Search', 'B', 'low')
    await u.click(within(bugsView()).getAllByRole('button', { name: /close/i })[0])
    await nav(u, 'Quality')
    expect(within(quality()).getByText(/search: 1 open \/ 2 total/i)).toBeInTheDocument()
  })

  it('shows a feature with no bugs as 0 open / 0 total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Billing')
    await nav(u, 'Quality')
    expect(within(quality()).getByText(/billing: 0 open \/ 0 total/i)).toBeInTheDocument()
  })

  it('flags a feature at risk for an open high-severity bug', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Search')
    await nav(u, 'Bugs')
    await fileBug(u, 'Search', 'Data loss', 'high')
    await nav(u, 'Quality')
    expect(within(quality()).getByText(/search: 1 open \/ 1 total/i)).toBeInTheDocument()
    expect(within(quality()).getByText(/at risk/i)).toBeInTheDocument()
  })

  it('does not flag at risk when the only high bug is closed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Search')
    await nav(u, 'Bugs')
    await fileBug(u, 'Search', 'Data loss', 'high')
    await u.click(within(bugsView()).getByRole('button', { name: /close/i }))
    await nav(u, 'Quality')
    expect(within(quality()).queryByText(/at risk/i)).not.toBeInTheDocument()
  })

  it('does not flag at risk for an open low-severity bug', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Search')
    await nav(u, 'Bugs')
    await fileBug(u, 'Search', 'Typo', 'low')
    await nav(u, 'Quality')
    expect(within(quality()).queryByText(/at risk/i)).not.toBeInTheDocument()
  })

  it('totals open bugs across features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Search')
    await addFeature(u, 'Billing')
    await nav(u, 'Bugs')
    await fileBug(u, 'Search', 'A', 'low')
    await fileBug(u, 'Billing', 'B', 'high')
    await nav(u, 'Quality')
    expect(within(quality()).getByText(/open bugs: 2/i)).toBeInTheDocument()
  })

  it('updates open bugs total after a close', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Search')
    await nav(u, 'Bugs')
    await fileBug(u, 'Search', 'A', 'low')
    await fileBug(u, 'Search', 'B', 'low')
    await u.click(within(bugsView()).getAllByRole('button', { name: /close/i })[0])
    await nav(u, 'Quality')
    expect(within(quality()).getByText(/open bugs: 1/i)).toBeInTheDocument()
  })

  it('names the healthiest feature by fewest open bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Search')
    await addFeature(u, 'Billing')
    await nav(u, 'Bugs')
    await fileBug(u, 'Search', 'A', 'low')
    await fileBug(u, 'Search', 'B', 'low')
    await nav(u, 'Quality')
    expect(within(quality()).getByText(/healthiest feature: billing/i)).toBeInTheDocument()
  })

  it('breaks a healthiest tie toward the feature added first', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Search')
    await addFeature(u, 'Billing')
    await nav(u, 'Quality')
    expect(within(quality()).getByText(/healthiest feature: search/i)).toBeInTheDocument()
  })

  it('shows healthiest none with no features', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Quality')
    expect(within(quality()).getByText(/healthiest feature: none/i)).toBeInTheDocument()
    expect(within(quality()).getByText(/open bugs: 0/i)).toBeInTheDocument()
  })

  it('only lists features in the bug selector that were added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Search')
    await nav(u, 'Bugs')
    const select = screen.getByLabelText(/^feature$/i)
    expect(within(select).getByRole('option', { name: 'Search' })).toBeInTheDocument()
    expect(within(select).queryByRole('option', { name: 'Billing' })).not.toBeInTheDocument()
  })

  it('keeps state across navigation', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeature(u, 'Search')
    await nav(u, 'Bugs')
    await fileBug(u, 'Search', 'A', 'high')
    await nav(u, 'Features')
    await nav(u, 'Quality')
    expect(within(quality()).getByText(/search: 1 open \/ 1 total/i)).toBeInTheDocument()
  })
})
