import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Package Compare', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders heading', () => {
    expect(screen.getByTestId('heading').textContent).toBe('Package Compare')
  })

  it('renders all 6 packages', () => {
    expect(screen.getByTestId('pkg-item-1')).toBeTruthy()
    expect(screen.getByTestId('pkg-item-6')).toBeTruthy()
  })

  it('renders package name downloads and stars', () => {
    expect(screen.getByTestId('pkg-name-1').textContent).toBe('lodash')
    expect(screen.getByTestId('pkg-downloads-1').textContent).toBe('45000000')
    expect(screen.getByTestId('pkg-stars-1').textContent).toBe('58000')
  })

  it('renders package size', () => {
    expect(screen.getByTestId('pkg-size-6').textContent).toBe('14')
  })

  it('default sort is by downloads descending (axios first)', () => {
    const items = screen.getAllByTestId(/^pkg-item-/)
    const firstItem = items[0]
    expect(firstItem.getAttribute('data-testid')).toBe('pkg-item-6')
  })

  it('sort by stars puts axios first', async () => {
    await userEvent.selectOptions(screen.getByTestId('sort-select'), 'stars')
    const items = screen.getAllByTestId(/^pkg-item-/)
    expect(items[0].getAttribute('data-testid')).toBe('pkg-item-6')
  })

  it('sort by size puts axios first (smallest)', async () => {
    await userEvent.selectOptions(screen.getByTestId('sort-select'), 'size')
    const items = screen.getAllByTestId(/^pkg-item-/)
    expect(items[0].getAttribute('data-testid')).toBe('pkg-item-6')
  })

  it('sort by issues puts underscore first (fewest)', async () => {
    await userEvent.selectOptions(screen.getByTestId('sort-select'), 'issues')
    const items = screen.getAllByTestId(/^pkg-item-/)
    expect(items[0].getAttribute('data-testid')).toBe('pkg-item-2')
  })

  it('compare panel not shown initially', () => {
    expect(screen.queryByTestId('compare-panel')).toBeNull()
  })

  it('selecting one package does not show compare panel', async () => {
    await userEvent.click(screen.getByTestId('select-1'))
    expect(screen.queryByTestId('compare-panel')).toBeNull()
  })

  it('selecting two packages shows compare panel', async () => {
    await userEvent.click(screen.getByTestId('select-1'))
    await userEvent.click(screen.getByTestId('select-6'))
    expect(screen.getByTestId('compare-panel')).toBeTruthy()
  })

  it('compare-winner-downloads shows correct winner', async () => {
    await userEvent.click(screen.getByTestId('select-1'))
    await userEvent.click(screen.getByTestId('select-6'))
    expect(screen.getByTestId('compare-winner-downloads').textContent).toBe('axios')
  })

  it('compare-winner-stars shows correct winner', async () => {
    await userEvent.click(screen.getByTestId('select-1'))
    await userEvent.click(screen.getByTestId('select-6'))
    expect(screen.getByTestId('compare-winner-stars').textContent).toBe('axios')
  })

  it('compare-winner-size shows package with smaller size', async () => {
    await userEvent.click(screen.getByTestId('select-1'))
    await userEvent.click(screen.getByTestId('select-6'))
    expect(screen.getByTestId('compare-winner-size').textContent).toBe('axios')
  })

  it('third selection is ignored', async () => {
    await userEvent.click(screen.getByTestId('select-1'))
    await userEvent.click(screen.getByTestId('select-6'))
    await userEvent.click(screen.getByTestId('select-2'))
    expect((screen.getByTestId('select-2') as HTMLInputElement).checked).toBe(false)
  })

  it('deselecting one hides compare panel', async () => {
    await userEvent.click(screen.getByTestId('select-1'))
    await userEvent.click(screen.getByTestId('select-6'))
    await userEvent.click(screen.getByTestId('select-1'))
    expect(screen.queryByTestId('compare-panel')).toBeNull()
  })

  it('clear selection unchecks all', async () => {
    await userEvent.click(screen.getByTestId('select-1'))
    await userEvent.click(screen.getByTestId('select-6'))
    await userEvent.click(screen.getByTestId('clear-selection'))
    expect((screen.getByTestId('select-1') as HTMLInputElement).checked).toBe(false)
    expect((screen.getByTestId('select-6') as HTMLInputElement).checked).toBe(false)
    expect(screen.queryByTestId('compare-panel')).toBeNull()
  })
})
