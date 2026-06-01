import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('dashboard and add flow', () => {
  it('shows the company rollup and objective count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-dashboard'))
    // (60 + 100) / 2 = 80
    expect(screen.getByTestId('company-progress')).toHaveTextContent('80')
    expect(screen.getByTestId('objective-count')).toHaveTextContent('2')
  })

  it('lists each objective progress on the dashboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('dashboard-o1-progress')).toHaveTextContent('60')
    expect(screen.getByTestId('dashboard-o2-progress')).toHaveTextContent('100')
  })

  it('company rollup updates after editing a key result', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-o1'))
    fireEvent.change(screen.getByTestId('kr-kr1-input'), { target: { value: '100' } })
    await user.click(screen.getByTestId('nav-dashboard'))
    // o1 -> (100 + 80)/2 = 90; company (90 + 100)/2 = 95
    expect(screen.getByTestId('company-progress')).toHaveTextContent('95')
  })

  it('blocks adding an objective with empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.click(screen.getByTestId('submit-objective'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('adds an objective with zero progress (no key results)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('title-input'), 'Expand market')
    await user.type(screen.getByTestId('owner-input'), 'Linus')
    await user.click(screen.getByTestId('submit-objective'))
    expect(screen.getByTestId('page-objectives')).toBeInTheDocument()
    expect(screen.getByTestId('objective-o3-title')).toHaveTextContent('Expand market')
    expect(screen.getByTestId('objective-o3-progress')).toHaveTextContent('0')
  })

  it('adding an objective changes the company rollup and count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('title-input'), 'Newco')
    await user.click(screen.getByTestId('submit-objective'))
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('objective-count')).toHaveTextContent('3')
    // (60 + 100 + 0) / 3 = 53.33 -> 53
    expect(screen.getByTestId('company-progress')).toHaveTextContent('53')
  })

  it('keeps theme on app-root across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    const list = screen.getByTestId('dashboard-list')
    expect(within(list).getByTestId('dashboard-o1')).toBeInTheDocument()
  })
})
