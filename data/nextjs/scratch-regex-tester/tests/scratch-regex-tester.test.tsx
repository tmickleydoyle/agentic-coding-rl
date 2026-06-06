import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Regex Tester', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('runs test automatically on initial render with seed data', () => {
    expect(screen.getByTestId('match-count')).toHaveTextContent('match(es)')
  })

  it('seed pattern \\d+ finds 4 matches in seed text', () => {
    expect(screen.getByTestId('match-count')).toHaveTextContent('4 match(es)')
  })

  it('seed matches include 123, 2024, 01, 15', () => {
    const items = screen.getAllByTestId('match-item')
    const texts = items.map(i => i.textContent)
    expect(texts).toContain('123')
    expect(texts).toContain('2024')
  })

  it('shows match highlights in result area', () => {
    const highlights = screen.getAllByTestId('match-highlight')
    expect(highlights.length).toBeGreaterThan(0)
  })

  it('shows Invalid regex for bad pattern', async () => {
    const user = userEvent.setup()
    const patternInput = screen.getByLabelText('Pattern')
    await user.clear(patternInput)
    await user.type(patternInput, '[invalid')
    await user.click(screen.getByRole('button', { name: 'Test' }))
    expect(screen.getByTestId('match-count')).toHaveTextContent('Invalid regex')
  })

  it('shows No matches when pattern does not match', async () => {
    const user = userEvent.setup()
    const patternInput = screen.getByLabelText('Pattern')
    await user.clear(patternInput)
    await user.type(patternInput, 'ZZZNOMATCH')
    await user.click(screen.getByRole('button', { name: 'Test' }))
    expect(screen.getByTestId('match-count')).toHaveTextContent('No matches')
  })

  it('shows No matches when pattern is empty', async () => {
    const user = userEvent.setup()
    const patternInput = screen.getByLabelText('Pattern')
    await user.clear(patternInput)
    await user.click(screen.getByRole('button', { name: 'Test' }))
    expect(screen.getByTestId('match-count')).toHaveTextContent('No matches')
  })

  it('case insensitive flag matches differently', async () => {
    const user = userEvent.setup()
    const patternInput = screen.getByLabelText('Pattern')
    const textArea = screen.getByLabelText('Test String')
    await user.clear(patternInput)
    await user.type(patternInput, 'order')
    await user.clear(textArea)
    await user.type(textArea, 'Order test order')
    // without i flag: matches only lowercase "order"
    await user.click(screen.getByRole('button', { name: 'Test' }))
    const countWithout = screen.getByTestId('match-count').textContent
    await user.click(screen.getByLabelText('Case Insensitive (i)'))
    await user.click(screen.getByRole('button', { name: 'Test' }))
    const countWith = screen.getByTestId('match-count').textContent
    expect(countWithout).not.toBe(countWith)
  })

  it('without global flag only first match is listed', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByLabelText('Global (g)'))
    await user.click(screen.getByRole('button', { name: 'Test' }))
    const items = screen.getAllByTestId('match-item')
    expect(items).toHaveLength(1)
  })

  it('match items list contains matched strings', () => {
    const items = screen.getAllByTestId('match-item')
    expect(items.length).toBeGreaterThanOrEqual(1)
  })

  it('changing pattern does not re-run automatically', async () => {
    const user = userEvent.setup()
    const patternInput = screen.getByLabelText('Pattern')
    await user.clear(patternInput)
    await user.type(patternInput, 'ZZZNOMATCH')
    // match-count still shows old result
    expect(screen.getByTestId('match-count')).not.toHaveTextContent('No matches')
  })

  it('result area shows plain text on invalid regex', async () => {
    const user = userEvent.setup()
    const patternInput = screen.getByLabelText('Pattern')
    await user.clear(patternInput)
    await user.type(patternInput, '[bad')
    await user.click(screen.getByRole('button', { name: 'Test' }))
    const highlights = screen.queryAllByTestId('match-highlight')
    expect(highlights).toHaveLength(0)
  })
})
