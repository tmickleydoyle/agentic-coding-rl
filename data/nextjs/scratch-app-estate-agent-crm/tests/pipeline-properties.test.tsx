import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('pipeline and properties', () => {
  it('shows per-stage counts from seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pipeline'))
    expect(screen.getByTestId('stage-new-count')).toHaveTextContent('1')
    expect(screen.getByTestId('stage-touring-count')).toHaveTextContent('1')
    expect(screen.getByTestId('stage-offer-count')).toHaveTextContent('1')
    expect(screen.getByTestId('stage-closed-count')).toHaveTextContent('0')
  })

  it('lists a lead under its stage column', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pipeline'))
    expect(screen.getByTestId('stage-touring-lead-l2')).toBeInTheDocument()
    expect(screen.getByTestId('stage-offer-lead-l3')).toBeInTheDocument()
  })

  it('moves a lead across stages and updates pipeline counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-l1')) // new
    await user.selectOptions(screen.getByTestId('status-select'), 'offer')
    await user.click(screen.getByTestId('detail-back'))
    await user.click(screen.getByTestId('nav-pipeline'))
    expect(screen.getByTestId('stage-new-count')).toHaveTextContent('0')
    expect(screen.getByTestId('stage-offer-count')).toHaveTextContent('2')
    expect(screen.getByTestId('stage-offer-lead-l1')).toBeInTheDocument()
  })

  it('lists properties with their assigned-lead counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-properties'))
    expect(screen.getByTestId('property-p1-leads')).toHaveTextContent('1') // l2
    expect(screen.getByTestId('property-p2-leads')).toHaveTextContent('1') // l3
  })

  it('reflects a new assignment in the property lead counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-l1'))
    await user.selectOptions(screen.getByTestId('assign-select'), 'p1')
    await user.click(screen.getByTestId('detail-back'))
    await user.click(screen.getByTestId('nav-properties'))
    expect(screen.getByTestId('property-p1-leads')).toHaveTextContent('2') // l1 + l2
  })
})
