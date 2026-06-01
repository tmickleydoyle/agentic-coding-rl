import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('availability view', () => {
  it('shows tables that fit a party of 2 at the default time', () => {
    render(<App />)
    // default time 17:00, party 2 — all three tables free and fit
    expect(screen.getByTestId('avail-t1')).toBeInTheDocument()
    expect(screen.getByTestId('avail-t2')).toBeInTheDocument()
    expect(screen.getByTestId('avail-t3')).toBeInTheDocument()
  })

  it('hides tables too small for a large party', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByTestId('party-input'))
    await user.type(screen.getByTestId('party-input'), '5')
    // only t3 (capacity 6) fits a party of 5
    expect(screen.queryByTestId('avail-t1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('avail-t2')).not.toBeInTheDocument()
    expect(screen.getByTestId('avail-t3')).toBeInTheDocument()
  })

  it('hides a table already reserved at the chosen time', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('time-select'), '19:00')
    // t1 is reserved at 19:00 in seed data
    expect(screen.queryByTestId('avail-t1')).not.toBeInTheDocument()
    expect(screen.getByTestId('avail-t2')).toBeInTheDocument()
  })

  it('shows none-available when nothing fits', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByTestId('party-input'))
    await user.type(screen.getByTestId('party-input'), '9')
    expect(screen.getByTestId('none-available')).toBeInTheDocument()
    expect(screen.queryByTestId('available-list')).not.toBeInTheDocument()
  })
})
