import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Language Cards', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: 'Language Cards' })).toBeTruthy()
  })

  it('renders all 6 cards by default', () => {
    expect(screen.getByTestId('card-1')).toBeTruthy()
    expect(screen.getByTestId('card-6')).toBeTruthy()
  })

  it('shows card fronts', () => {
    expect(screen.getByTestId('card-front-1').textContent).toBe('Hola')
    expect(screen.getByTestId('card-front-3').textContent).toBe('Bonjour')
  })

  it('hides card back by default', () => {
    expect(screen.queryByTestId('card-back-1')).toBeNull()
  })

  it('shows card back after clicking Show', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('flip-1'))
    expect(screen.getByTestId('card-back-1').textContent).toBe('Hello')
  })

  it('flip button changes text to Hide after clicking Show', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('flip-1'))
    expect(screen.getByTestId('flip-1').textContent).toBe('Hide')
  })

  it('hides card back again after clicking Hide', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('flip-2'))
    await user.click(screen.getByTestId('flip-2'))
    expect(screen.queryByTestId('card-back-2')).toBeNull()
  })

  it('initial card count shows 0 / 6', () => {
    expect(screen.getByTestId('card-count').textContent).toContain('0 / 6')
  })

  it('marks card as known and updates count', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('known-1'))
    expect(screen.getByTestId('card-count').textContent).toContain('1 / 6')
    expect(screen.getByTestId('known-1').textContent).toBe('Mark Unknown')
  })

  it('card container has class known when marked', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('known-2'))
    expect(screen.getByTestId('card-2').className).toContain('known')
  })

  it('unmarks known card and updates count', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('known-1'))
    await user.click(screen.getByTestId('known-1'))
    expect(screen.getByTestId('card-count').textContent).toContain('0 / 6')
  })

  it('filters by Spanish shows only Spanish cards', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('language-filter'), 'Spanish')
    expect(screen.getByTestId('card-1')).toBeTruthy()
    expect(screen.getByTestId('card-2')).toBeTruthy()
    expect(screen.queryByTestId('card-3')).toBeNull()
  })

  it('filter updates card count', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('language-filter'), 'French')
    expect(screen.getByTestId('card-count').textContent).toContain('0 / 2')
  })

  it('known count reflects filtered view', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('known-3'))
    await user.selectOptions(screen.getByTestId('language-filter'), 'French')
    expect(screen.getByTestId('card-count').textContent).toContain('1 / 2')
  })

  it('language filter has All, Spanish, French, Italian options', () => {
    const select = screen.getByTestId('language-filter') as HTMLSelectElement
    const options = Array.from(select.options).map(o => o.value)
    expect(options).toContain('All')
    expect(options).toContain('Spanish')
    expect(options).toContain('French')
    expect(options).toContain('Italian')
  })
})
