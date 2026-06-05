import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('upcoming vs past split', () => {
  it('appointments page shows only upcoming (date >= today)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-appointments'))
    // a1 (2026-06-10) is upcoming; a2 (2026-05-20) is past
    expect(screen.getByTestId('appt-a1')).toBeInTheDocument()
    expect(screen.queryByTestId('appt-a2')).not.toBeInTheDocument()
  })

  it('history page shows only past appointments', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('past-a2')).toBeInTheDocument()
    expect(screen.queryByTestId('past-a1')).not.toBeInTheDocument()
    expect(screen.getByTestId('past-a2-patient')).toHaveTextContent('Pat')
  })

  it('past appointments cannot be cancelled (no cancel button)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.queryByTestId('cancel-a2')).not.toBeInTheDocument()
  })

  it('a newly booked future appointment lands under upcoming, not history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-p2')) // open slot 2026-06-15 (future)
    await user.type(screen.getByTestId('patient-input'), 'Margaret')
    await user.click(screen.getByTestId('submit-appointment'))
    expect(screen.getByTestId('page-appointments')).toBeInTheDocument()
    expect(screen.getByTestId('appt-a3')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.queryByTestId('past-a3')).not.toBeInTheDocument()
  })
})
