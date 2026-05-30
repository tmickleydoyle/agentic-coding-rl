import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('week grid', () => {
  it('shows meal counts per day from seed data', () => {
    render(<App />)
    // Mon has 2 assignments, the rest have 0
    expect(screen.getByTestId('day-Mon-count')).toHaveTextContent('2')
    expect(screen.getByTestId('day-Tue-count')).toHaveTextContent('0')
    expect(screen.getByTestId('day-Sun-count')).toHaveTextContent('0')
  })

  it('renders all seven days', () => {
    render(<App />)
    ;['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((d) => {
      expect(screen.getByTestId(`day-${d}`)).toBeInTheDocument()
    })
  })

  it('opening a day navigates to its detail with the right title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-Mon'))
    expect(screen.getByTestId('page-day-detail')).toBeInTheDocument()
    expect(screen.getByTestId('day-title')).toHaveTextContent('Mon')
  })
})

describe('day detail assign/unassign', () => {
  it('lists seeded meals for Monday', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-Mon'))
    const list = screen.getByTestId('assignment-list')
    expect(within(list).getByText('Oatmeal')).toBeInTheDocument()
    expect(within(list).getByText('Veggie Stir Fry')).toBeInTheDocument()
  })

  it('shows an empty state for a day with no meals', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-Tue'))
    expect(screen.getByTestId('day-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('assignment-list')).not.toBeInTheDocument()
  })

  it('assigns a recipe to a day', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-Wed'))
    await user.selectOptions(screen.getByTestId('assign-select'), 'r3')
    await user.click(screen.getByTestId('assign-button'))
    const list = screen.getByTestId('assignment-list')
    expect(within(list).getByText('Caesar Salad')).toBeInTheDocument()
  })

  it('removes a meal from a day', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-Mon'))
    expect(screen.getByTestId('assignment-a1')).toBeInTheDocument()
    await user.click(screen.getByTestId('remove-a1'))
    expect(screen.queryByTestId('assignment-a1')).not.toBeInTheDocument()
  })

  it('the week grid count updates after assigning', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-Fri'))
    await user.selectOptions(screen.getByTestId('assign-select'), 'r1')
    await user.click(screen.getByTestId('assign-button'))
    await user.click(screen.getByTestId('nav-week'))
    expect(screen.getByTestId('day-Fri-count')).toHaveTextContent('1')
  })
})

describe('recipes page', () => {
  it('shows ingredient counts per recipe', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-recipes'))
    expect(screen.getByTestId('ingredient-count-r1')).toHaveTextContent('3')
    expect(screen.getByTestId('ingredient-count-r2')).toHaveTextContent('4')
  })
})
