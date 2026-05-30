import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function goToPeople(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('nav-people'))
}

describe('people page', () => {
  it('lists seeded people', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToPeople(user)
    const list = screen.getByTestId('people-list')
    expect(within(list).getByText('Alice')).toBeInTheDocument()
    expect(within(list).getByText('Bob')).toBeInTheDocument()
    expect(within(list).getByText('Carol')).toBeInTheDocument()
  })

  it('blocks adding a person with a blank name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToPeople(user)
    await user.click(screen.getByTestId('submit-person'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds a person and shows them in the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToPeople(user)
    await user.type(screen.getByTestId('name-input'), 'Dave')
    await user.click(screen.getByTestId('submit-person'))
    expect(screen.getByTestId('person-u4')).toBeInTheDocument()
    expect(screen.getByTestId('person-u4-name')).toHaveTextContent('Dave')
  })

  it('re-splits the share when a person is added', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToPeople(user)
    await user.type(screen.getByTestId('name-input'), 'Dave')
    await user.click(screen.getByTestId('submit-person'))
    await user.click(screen.getByTestId('nav-dashboard'))
    // total still 180, now / 4 = 45
    expect(screen.getByTestId('stat-perhead-value')).toHaveTextContent('45')
  })
})
