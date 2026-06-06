import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Tech Radar', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders heading', () => {
    expect(screen.getByTestId('heading').textContent).toBe('Tech Radar')
  })

  it('renders all 8 seed technologies', () => {
    expect(screen.getByTestId('tech-count').textContent).toBe('8 technologies')
  })

  it('renders tech name and status for first item', () => {
    expect(screen.getByTestId('tech-name-1').textContent).toBe('TypeScript')
    expect(screen.getByTestId('tech-status-1').textContent).toBe('Adopt')
    expect(screen.getByTestId('tech-category-1').textContent).toBe('Languages')
  })

  it('filter by status Adopt shows correct count', async () => {
    await userEvent.click(screen.getByTestId('filter-adopt'))
    expect(screen.getByTestId('tech-count').textContent).toBe('3 technologies')
  })

  it('filter by status Hold shows only CoffeeScript', async () => {
    await userEvent.click(screen.getByTestId('filter-hold'))
    expect(screen.getByTestId('tech-count').textContent).toBe('1 technologies')
    expect(screen.getByTestId('tech-name-4').textContent).toBe('CoffeeScript')
  })

  it('filter-all resets status filter', async () => {
    await userEvent.click(screen.getByTestId('filter-trial'))
    await userEvent.click(screen.getByTestId('filter-all'))
    expect(screen.getByTestId('tech-count').textContent).toBe('8 technologies')
  })

  it('category select filters by category', async () => {
    await userEvent.selectOptions(screen.getByTestId('category-select'), 'Runtimes')
    expect(screen.getByTestId('tech-count').textContent).toBe('2 technologies')
  })

  it('status and category filters combine', async () => {
    await userEvent.click(screen.getByTestId('filter-assess'))
    await userEvent.selectOptions(screen.getByTestId('category-select'), 'Runtimes')
    expect(screen.getByTestId('tech-count').textContent).toBe('2 technologies')
  })

  it('status and category filters combine to zero', async () => {
    await userEvent.click(screen.getByTestId('filter-hold'))
    await userEvent.selectOptions(screen.getByTestId('category-select'), 'Runtimes')
    expect(screen.getByTestId('tech-count').textContent).toBe('0 technologies')
  })

  it('add button with empty name does nothing', async () => {
    await userEvent.click(screen.getByTestId('add-button'))
    expect(screen.getByTestId('tech-count').textContent).toBe('8 technologies')
  })

  it('adds new technology', async () => {
    await userEvent.type(screen.getByTestId('add-name'), 'Rust')
    await userEvent.click(screen.getByTestId('add-button'))
    expect(screen.getByTestId('tech-count').textContent).toBe('9 technologies')
  })

  it('new tech appears with correct name', async () => {
    await userEvent.type(screen.getByTestId('add-name'), 'Elm')
    await userEvent.selectOptions(screen.getByTestId('add-category'), 'Languages')
    await userEvent.selectOptions(screen.getByTestId('add-status'), 'Trial')
    await userEvent.click(screen.getByTestId('add-button'))
    const count = screen.getByTestId('tech-count').textContent
    expect(count).toBe('9 technologies')
  })

  it('add clears name input', async () => {
    await userEvent.type(screen.getByTestId('add-name'), 'Go')
    await userEvent.click(screen.getByTestId('add-button'))
    expect((screen.getByTestId('add-name') as HTMLInputElement).value).toBe('')
  })

  it('remove button removes a technology', async () => {
    await userEvent.click(screen.getByTestId('remove-1'))
    expect(screen.getByTestId('tech-count').textContent).toBe('7 technologies')
    expect(screen.queryByTestId('tech-item-1')).toBeNull()
  })

  it('tech-item contains name status and category', () => {
    const item = screen.getByTestId('tech-item-5')
    expect(item).toBeTruthy()
    expect(screen.getByTestId('tech-name-5').textContent).toBe('React')
    expect(screen.getByTestId('tech-status-5').textContent).toBe('Adopt')
    expect(screen.getByTestId('tech-category-5').textContent).toBe('Frameworks')
  })
})
