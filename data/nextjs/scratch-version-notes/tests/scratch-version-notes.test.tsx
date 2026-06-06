import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Version Notes', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders heading', () => {
    expect(screen.getByTestId('heading').textContent).toBe('Version Notes')
  })

  it('shows all 8 releases initially', () => {
    expect(screen.getByTestId('release-count').textContent).toBe('8 releases')
  })

  it('renders release version and package', () => {
    expect(screen.getByTestId('release-version-1').textContent).toBe('3.0.0')
    expect(screen.getByTestId('release-package-1').textContent).toBe('myapp')
  })

  it('renders release type', () => {
    expect(screen.getByTestId('release-type-1').textContent).toBe('major')
  })

  it('shows Breaking for breaking release', () => {
    expect(screen.getByTestId('release-breaking-1').textContent).toBe('Breaking')
  })

  it('shows Safe for non-breaking release', () => {
    expect(screen.getByTestId('release-breaking-2').textContent).toBe('Safe')
  })

  it('releases are sorted newest first (id 1 before id 3)', () => {
    const items = screen.getAllByTestId(/^release-item-/)
    const ids = items.map(el => el.getAttribute('data-testid'))
    expect(ids.indexOf('release-item-1')).toBeLessThan(ids.indexOf('release-item-3'))
  })

  it('filter by major type', async () => {
    await userEvent.click(screen.getByTestId('filter-major'))
    expect(screen.getByTestId('release-count').textContent).toBe('3 releases')
  })

  it('filter by patch type', async () => {
    await userEvent.click(screen.getByTestId('filter-patch'))
    expect(screen.getByTestId('release-count').textContent).toBe('2 releases')
  })

  it('filter-all resets type filter', async () => {
    await userEvent.click(screen.getByTestId('filter-minor'))
    await userEvent.click(screen.getByTestId('filter-all'))
    expect(screen.getByTestId('release-count').textContent).toBe('8 releases')
  })

  it('package select filters by package', async () => {
    await userEvent.selectOptions(screen.getByTestId('package-select'), 'plugin-a')
    expect(screen.getByTestId('release-count').textContent).toBe('2 releases')
  })

  it('breaking-only checkbox filters', async () => {
    await userEvent.click(screen.getByTestId('breaking-checkbox'))
    expect(screen.getByTestId('release-count').textContent).toBe('2 releases')
  })

  it('type and package filters combine', async () => {
    await userEvent.click(screen.getByTestId('filter-patch'))
    await userEvent.selectOptions(screen.getByTestId('package-select'), 'myapp')
    expect(screen.getByTestId('release-count').textContent).toBe('2 releases')
  })

  it('add with empty version does nothing', async () => {
    await userEvent.click(screen.getByTestId('add-button'))
    expect(screen.getByTestId('release-count').textContent).toBe('8 releases')
  })

  it('add new release increases count', async () => {
    await userEvent.type(screen.getByTestId('add-version'), '4.0.0')
    await userEvent.click(screen.getByTestId('add-button'))
    expect(screen.getByTestId('release-count').textContent).toBe('9 releases')
  })

  it('added release appears at top (newest date)', async () => {
    await userEvent.type(screen.getByTestId('add-version'), '4.0.0')
    await userEvent.click(screen.getByTestId('add-button'))
    const items = screen.getAllByTestId(/^release-item-/)
    expect(items[0].getAttribute('data-testid')).toBe('release-item-9')
  })

  it('delete removes a release', async () => {
    await userEvent.click(screen.getByTestId('delete-1'))
    expect(screen.queryByTestId('release-item-1')).toBeNull()
    expect(screen.getByTestId('release-count').textContent).toBe('7 releases')
  })
})
