import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('today and log flow', () => {
  it('shows today pages, streak and logged flag from seed', () => {
    render(<App />)
    expect(screen.getByTestId('today-date')).toHaveTextContent('2026-05-28')
    expect(screen.getByTestId('today-pages')).toHaveTextContent('20')
    expect(screen.getByTestId('today-streak')).toHaveTextContent('3')
    expect(screen.getByTestId('today-logged')).toHaveAttribute('data-logged', 'true')
  })

  it('lists seed logs most-recent-first on the log page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-log'))
    const rows = screen.getByTestId('log-list').querySelectorAll('li')
    expect(rows[0].getAttribute('data-testid')).toBe('log-l3') // 05-28
    expect(rows[2].getAttribute('data-testid')).toBe('log-l1') // 05-26
  })

  it('blocks logging an invalid page count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-log'))
    await user.type(screen.getByTestId('pages-input'), 'abc')
    await user.click(screen.getByTestId('submit-pages'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-log')).toBeInTheDocument()
  })

  it('logging today upserts the existing entry and navigates to today', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-log'))
    await user.type(screen.getByTestId('pages-input'), '50')
    await user.click(screen.getByTestId('submit-pages'))
    expect(screen.getByTestId('page-today')).toBeInTheDocument()
    expect(screen.getByTestId('today-pages')).toHaveTextContent('50')
    // upsert: still 3 logs
    await user.click(screen.getByTestId('nav-log'))
    expect(screen.getByTestId('log-list').querySelectorAll('li').length).toBe(3)
  })

  it('removes a log from the log list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-log'))
    await user.click(screen.getByTestId('remove-l1'))
    expect(screen.queryByTestId('log-l1')).not.toBeInTheDocument()
  })

  it('removing today log lowers today pages and streak', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-log'))
    await user.click(screen.getByTestId('remove-l3'))
    await user.click(screen.getByTestId('nav-today'))
    expect(screen.getByTestId('today-pages')).toHaveTextContent('0')
    expect(screen.getByTestId('today-logged')).toHaveAttribute('data-logged', 'false')
    // 05-27 still logged (yesterday) => streak 2
    expect(screen.getByTestId('today-streak')).toHaveTextContent('2')
  })

  it('shows an empty state when all logs are removed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-log'))
    await user.click(screen.getByTestId('remove-l1'))
    await user.click(screen.getByTestId('remove-l2'))
    await user.click(screen.getByTestId('remove-l3'))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('log-list')).not.toBeInTheDocument()
  })
})
