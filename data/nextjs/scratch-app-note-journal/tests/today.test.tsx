import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('today page', () => {
  it('shows the fixed today date', () => {
    render(<App />)
    expect(screen.getByTestId('today-date')).toHaveTextContent('2026-05-29')
  })

  it('shows an empty state since no seed entry is dated today', () => {
    render(<App />)
    expect(screen.getByTestId('today-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('today-list')).not.toBeInTheDocument()
  })

  it('an entry added for today appears on the today page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    await user.type(screen.getByTestId('body-input'), 'Today was great')
    await user.click(screen.getByTestId('save-entry'))
    await user.click(screen.getByTestId('nav-today'))
    expect(screen.getByTestId('today-list')).toBeInTheDocument()
    expect(screen.getByTestId('today-e4')).toBeInTheDocument()
    expect(screen.getByTestId('today-e4-mood')).toHaveTextContent('happy')
  })
})
