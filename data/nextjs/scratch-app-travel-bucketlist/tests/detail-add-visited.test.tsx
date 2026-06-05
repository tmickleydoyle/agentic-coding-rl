import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('destination detail', () => {
  it('shows no-selection when none picked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-destination-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('opens a destination and shows its details', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-d3'))
    expect(screen.getByTestId('page-destination-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Reykjavik')
    expect(screen.getByTestId('detail-continent')).toHaveTextContent('Europe')
    expect(screen.getByTestId('detail-visited')).toHaveTextContent('not visited')
  })

  it('toggles visited from the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-d3'))
    await user.click(screen.getByTestId('detail-toggle'))
    expect(screen.getByTestId('detail-visited')).toHaveTextContent('visited')
    await user.click(screen.getByTestId('nav-list'))
    expect(screen.getByTestId('dest-d3')).toHaveAttribute('data-visited', 'true')
  })
})

describe('add destination', () => {
  it('blocks submit when name is empty', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('continent-input'), 'Asia')
    await user.click(screen.getByTestId('submit-destination'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('blocks submit when continent is empty', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Bali')
    await user.click(screen.getByTestId('submit-destination'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds a destination that appears in its continent group', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Sydney')
    await user.type(screen.getByTestId('country-input'), 'Australia')
    await user.type(screen.getByTestId('continent-input'), 'Oceania')
    await user.click(screen.getByTestId('submit-destination'))
    expect(screen.getByTestId('page-list')).toBeInTheDocument()
    const group = screen.getByTestId('group-Oceania-list')
    expect(within(group).getByText('Sydney')).toBeInTheDocument()
    expect(screen.getByTestId('count-total')).toHaveTextContent('6')
  })
})

describe('visited page', () => {
  it('lists only visited destinations', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-visited'))
    const list = screen.getByTestId('visited-list')
    expect(within(list).getByTestId('dest-d1')).toBeInTheDocument()
    expect(within(list).getByTestId('dest-d4')).toBeInTheDocument()
    expect(within(list).queryByTestId('dest-d2')).not.toBeInTheDocument()
    expect(screen.getByTestId('visited-count')).toHaveTextContent('2')
    expect(screen.getByTestId('remaining-count')).toHaveTextContent('3')
  })

  it('reflects a newly visited destination', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('toggle-d2'))
    await user.click(screen.getByTestId('nav-visited'))
    expect(screen.getByTestId('dest-d2')).toBeInTheDocument()
    expect(screen.getByTestId('visited-count')).toHaveTextContent('3')
  })

  it('toggles theme and persists across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-visited'))
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-list'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})
