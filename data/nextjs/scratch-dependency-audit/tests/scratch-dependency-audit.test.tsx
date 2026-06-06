import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Dependency Audit', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders heading', () => {
    expect(screen.getByTestId('heading').textContent).toBe('Dependency Audit')
  })

  it('shows all 8 packages initially', () => {
    expect(screen.getByTestId('pkg-count').textContent).toBe('8 packages')
  })

  it('renders package name and version', () => {
    expect(screen.getByTestId('pkg-name-1').textContent).toBe('lodash')
    expect(screen.getByTestId('pkg-version-1').textContent).toBe('4.17.21')
  })

  it('renders severity and type', () => {
    expect(screen.getByTestId('pkg-severity-2').textContent).toBe('high')
    expect(screen.getByTestId('pkg-type-2').textContent).toBe('production')
  })

  it('filter by production type', async () => {
    await userEvent.click(screen.getByTestId('filter-production'))
    expect(screen.getByTestId('pkg-count').textContent).toBe('4 packages')
  })

  it('filter by dev type', async () => {
    await userEvent.click(screen.getByTestId('filter-dev'))
    expect(screen.getByTestId('pkg-count').textContent).toBe('4 packages')
  })

  it('filter-all resets type filter', async () => {
    await userEvent.click(screen.getByTestId('filter-dev'))
    await userEvent.click(screen.getByTestId('filter-all'))
    expect(screen.getByTestId('pkg-count').textContent).toBe('8 packages')
  })

  it('severity select filters packages', async () => {
    await userEvent.selectOptions(screen.getByTestId('severity-select'), 'high')
    expect(screen.getByTestId('pkg-count').textContent).toBe('1 packages')
  })

  it('outdated checkbox filters outdated packages', async () => {
    await userEvent.click(screen.getByTestId('outdated-checkbox'))
    expect(screen.getByTestId('pkg-count').textContent).toBe('4 packages')
  })

  it('all three filters combine', async () => {
    await userEvent.click(screen.getByTestId('filter-dev'))
    await userEvent.click(screen.getByTestId('outdated-checkbox'))
    expect(screen.getByTestId('pkg-count').textContent).toBe('2 packages')
  })

  it('shows initial critical count', () => {
    expect(screen.getByTestId('count-critical').textContent).toBe('1')
  })

  it('shows initial outdated count', () => {
    expect(screen.getByTestId('count-outdated').textContent).toBe('4')
  })

  it('resolve sets severity to none', async () => {
    await userEvent.click(screen.getByTestId('resolve-2'))
    expect(screen.getByTestId('pkg-severity-2').textContent).toBe('none')
  })

  it('resolve does not remove the package', async () => {
    await userEvent.click(screen.getByTestId('resolve-2'))
    expect(screen.getByTestId('pkg-item-2')).toBeTruthy()
    expect(screen.getByTestId('pkg-count').textContent).toBe('8 packages')
  })

  it('remove deletes a package', async () => {
    await userEvent.click(screen.getByTestId('remove-1'))
    expect(screen.queryByTestId('pkg-item-1')).toBeNull()
    expect(screen.getByTestId('pkg-count').textContent).toBe('7 packages')
  })

  it('critical count updates after resolve', async () => {
    await userEvent.click(screen.getByTestId('resolve-8'))
    expect(screen.getByTestId('count-critical').textContent).toBe('0')
  })
})
