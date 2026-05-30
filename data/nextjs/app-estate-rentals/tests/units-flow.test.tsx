import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('units and occupancy', () => {
  it('lists units with labels, rents and occupancy state', () => {
    render(<App />)
    expect(screen.getByTestId('unit-u1-label')).toHaveTextContent('A1')
    expect(screen.getByTestId('unit-u1-rent')).toHaveTextContent('1200')
    expect(screen.getByTestId('unit-u1')).toHaveAttribute('data-occupied', 'true')
    expect(screen.getByTestId('unit-u2')).toHaveAttribute('data-occupied', 'false')
    expect(screen.getByTestId('occupied-u2')).toHaveTextContent('Vacant')
  })

  it('toggles a unit occupancy from the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('toggle-u2'))
    expect(screen.getByTestId('unit-u2')).toHaveAttribute('data-occupied', 'true')
    await user.click(screen.getByTestId('toggle-u2'))
    expect(screen.getByTestId('unit-u2')).toHaveAttribute('data-occupied', 'false')
  })

  it('shows the occupancy rate and counts from seed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-occupancy'))
    // 1 of 3 occupied => 33%
    expect(screen.getByTestId('occupancy-rate')).toHaveTextContent('33%')
    expect(screen.getByTestId('occupied-count')).toHaveTextContent('1')
    expect(screen.getByTestId('vacant-count')).toHaveTextContent('2')
    expect(screen.getByTestId('pending-count')).toHaveTextContent('2')
  })

  it('updates the occupancy rate after toggling a unit occupied', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('toggle-u2'))
    await user.click(screen.getByTestId('nav-occupancy'))
    // 2 of 3 occupied => 67%
    expect(screen.getByTestId('occupancy-rate')).toHaveTextContent('67%')
    expect(screen.getByTestId('occupied-count')).toHaveTextContent('2')
  })

  it('opens a unit detail with its applications', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-u2'))
    expect(screen.getByTestId('page-unit-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-label')).toHaveTextContent('A2')
    expect(screen.getByTestId('detail-rent')).toHaveTextContent('1500')
    const list = screen.getByTestId('unit-app-list')
    expect(within(list).getByText('Ada')).toBeInTheDocument()
    expect(within(list).getByText('Lee')).toBeInTheDocument()
  })

  it('blocks applying with an empty applicant name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-u1'))
    await user.click(screen.getByTestId('submit-application'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds an application from the unit detail and shows it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-u1'))
    await user.type(screen.getByTestId('applicant-input'), 'Nora')
    await user.click(screen.getByTestId('submit-application'))
    expect(screen.getByTestId('page-unit-detail')).toBeInTheDocument()
    expect(within(screen.getByTestId('unit-app-list')).getByText('Nora')).toBeInTheDocument()
    expect(screen.getByTestId('unit-app-a4')).toHaveAttribute('data-status', 'pending')
  })
})
