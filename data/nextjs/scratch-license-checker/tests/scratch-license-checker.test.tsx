import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('License Checker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders heading', () => {
    expect(screen.getByTestId('heading').textContent).toBe('License Checker')
  })

  it('shows all 8 packages initially', () => {
    expect(screen.getByTestId('pkg-count').textContent).toBe('8 packages')
  })

  it('renders package name and license', () => {
    expect(screen.getByTestId('pkg-name-1').textContent).toBe('react')
    expect(screen.getByTestId('pkg-license-1').textContent).toBe('MIT')
  })

  it('shows approved status correctly', () => {
    expect(screen.getByTestId('pkg-approved-1').textContent).toBe('Approved')
    expect(screen.getByTestId('pkg-approved-3').textContent).toBe('Rejected')
  })

  it('filter-approved shows only approved packages', async () => {
    await userEvent.click(screen.getByTestId('filter-approved'))
    expect(screen.getByTestId('pkg-count').textContent).toBe('5 packages')
  })

  it('filter-rejected shows only rejected packages', async () => {
    await userEvent.click(screen.getByTestId('filter-rejected'))
    expect(screen.getByTestId('pkg-count').textContent).toBe('3 packages')
  })

  it('filter-all resets', async () => {
    await userEvent.click(screen.getByTestId('filter-approved'))
    await userEvent.click(screen.getByTestId('filter-all'))
    expect(screen.getByTestId('pkg-count').textContent).toBe('8 packages')
  })

  it('license select filters by license', async () => {
    await userEvent.selectOptions(screen.getByTestId('license-select'), 'MIT')
    expect(screen.getByTestId('pkg-count').textContent).toBe('3 packages')
  })

  it('approval and license filters combine', async () => {
    await userEvent.click(screen.getByTestId('filter-approved'))
    await userEvent.selectOptions(screen.getByTestId('license-select'), 'Apache-2.0')
    expect(screen.getByTestId('pkg-count').textContent).toBe('2 packages')
  })

  it('shows approved count', () => {
    expect(screen.getByTestId('count-approved').textContent).toBe('5')
  })

  it('shows rejected count', () => {
    expect(screen.getByTestId('count-rejected').textContent).toBe('3')
  })

  it('toggle flips approved status', async () => {
    await userEvent.click(screen.getByTestId('toggle-1'))
    expect(screen.getByTestId('pkg-approved-1').textContent).toBe('Rejected')
  })

  it('toggle updates counts', async () => {
    await userEvent.click(screen.getByTestId('toggle-3'))
    expect(screen.getByTestId('count-approved').textContent).toBe('6')
    expect(screen.getByTestId('count-rejected').textContent).toBe('2')
  })

  it('remove deletes package', async () => {
    await userEvent.click(screen.getByTestId('remove-1'))
    expect(screen.queryByTestId('pkg-item-1')).toBeNull()
    expect(screen.getByTestId('pkg-count').textContent).toBe('7 packages')
  })

  it('add with empty name does nothing', async () => {
    await userEvent.click(screen.getByTestId('add-button'))
    expect(screen.getByTestId('pkg-count').textContent).toBe('8 packages')
  })

  it('add new package defaults to rejected', async () => {
    await userEvent.type(screen.getByTestId('add-name'), 'new-pkg')
    await userEvent.type(screen.getByTestId('add-license'), 'BSD-2')
    await userEvent.click(screen.getByTestId('add-button'))
    expect(screen.getByTestId('pkg-count').textContent).toBe('9 packages')
    expect(screen.getByTestId('count-rejected').textContent).toBe('4')
  })
})
