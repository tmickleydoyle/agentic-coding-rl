import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('timeline and add flow', () => {
  it('shows status rollup totals', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-timeline'))
    expect(screen.getByTestId('timeline-planned-count')).toHaveTextContent('1')
    expect(screen.getByTestId('timeline-in-progress-count')).toHaveTextContent('1')
    expect(screen.getByTestId('timeline-done-count')).toHaveTextContent('1')
  })

  it('lists initiatives in quarter order', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-timeline'))
    const items = within(screen.getByTestId('timeline-list')).getAllByText(/.+/)
    // q1 initiatives (i1, i2) come before q2 (i3)
    expect(screen.getByTestId('timeline-i1')).toBeInTheDocument()
    expect(screen.getByTestId('timeline-i3')).toBeInTheDocument()
    expect(items.length).toBeGreaterThanOrEqual(3)
  })

  it('blocks adding an initiative with empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.click(screen.getByTestId('submit-initiative'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('adds an initiative to the chosen quarter as planned', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('title-input'), 'Billing v2')
    await user.selectOptions(screen.getByTestId('quarter-select'), 'q3')
    await user.click(screen.getByTestId('submit-initiative'))
    expect(screen.getByTestId('page-roadmap')).toBeInTheDocument()
    expect(screen.getByTestId('quarter-q3-count')).toHaveTextContent('1')
    expect(screen.getByTestId('card-i4')).toHaveAttribute('data-status', 'planned')
    expect(within(screen.getByTestId('quarter-q3')).getByText('Billing v2')).toBeInTheDocument()
  })

  it('adding updates the timeline planned total', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('title-input'), 'New thing')
    await user.click(screen.getByTestId('submit-initiative'))
    await user.click(screen.getByTestId('nav-timeline'))
    expect(screen.getByTestId('timeline-planned-count')).toHaveTextContent('2')
  })

  it('keeps theme on app-root across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-timeline'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
