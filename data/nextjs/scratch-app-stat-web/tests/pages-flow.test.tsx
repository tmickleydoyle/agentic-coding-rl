import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('pages flow', () => {
  it('lists all seeded pages with paths and bounce rates', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pages'))
    const list = screen.getByTestId('page-list')
    expect(within(list).getByTestId('page-pg1-path')).toHaveTextContent('/')
    expect(within(list).getByTestId('page-pg2-path')).toHaveTextContent('/blog')
    expect(within(list).getByTestId('page-pg3-bounce')).toHaveTextContent('70')
  })

  it('shows all-time views in the list by default', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pages'))
    expect(screen.getByTestId('page-pg1-views')).toHaveTextContent('1000')
  })

  it('reflects the selected range in the page list views', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    await user.selectOptions(screen.getByTestId('default-range'), '30d')
    await user.click(screen.getByTestId('nav-pages'))
    expect(screen.getByTestId('page-pg1-views')).toHaveTextContent('600')
  })

  it('shows no detail before a page is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pages'))
    expect(screen.queryByTestId('page-detail')).not.toBeInTheDocument()
  })

  it('selecting a page from overview top list navigates and shows detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pages'))
    await user.click(screen.getByTestId('select-pg2'))
    expect(screen.getByTestId('page-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-path')).toHaveTextContent('/blog')
    expect(screen.getByTestId('detail-sessions')).toHaveTextContent('500')
  })

  it('selectPage stays on the pages route and updates the detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pages'))
    await user.click(screen.getByTestId('select-pg4'))
    expect(screen.getByTestId('page-pages')).toBeInTheDocument()
    expect(screen.getByTestId('detail-path')).toHaveTextContent('/pricing')
  })
})
