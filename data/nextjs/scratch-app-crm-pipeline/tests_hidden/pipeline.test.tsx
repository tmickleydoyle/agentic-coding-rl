import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('pipeline board and deal detail', () => {
  it('places each seeded deal in the right stage column', () => {
    render(<App />)
    expect(within(screen.getByTestId('column-lead')).getByTestId('deal-d4')).toBeInTheDocument()
    expect(within(screen.getByTestId('column-qualified')).getByTestId('deal-d1')).toBeInTheDocument()
    expect(within(screen.getByTestId('column-proposal')).getByTestId('deal-d2')).toBeInTheDocument()
    expect(within(screen.getByTestId('column-won')).getByTestId('deal-d3')).toBeInTheDocument()
  })

  it('rolls up count and value per stage', () => {
    render(<App />)
    expect(screen.getByTestId('column-qualified-count')).toHaveTextContent('1')
    expect(screen.getByTestId('column-qualified-value')).toHaveTextContent('5000')
    expect(screen.getByTestId('column-proposal-value')).toHaveTextContent('12000')
    expect(screen.getByTestId('column-lost-count')).toHaveTextContent('0')
    expect(screen.getByTestId('column-lost-value')).toHaveTextContent('0')
  })

  it('opens a deal detail when clicking open', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-d1'))
    expect(screen.getByTestId('page-deal-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Analytical license')
    expect(screen.getByTestId('nav-deal-detail')).toHaveAttribute('aria-current', 'page')
  })

  it('detail page shows value, stage and contact name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-d2'))
    expect(screen.getByTestId('detail-value')).toHaveTextContent('12000')
    expect(screen.getByTestId('detail-stage')).toHaveTextContent('proposal')
    expect(screen.getByTestId('detail-contact')).toHaveTextContent('Grace Hopper')
  })

  it('moves a deal to another stage via the detail select', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-d1'))
    await user.selectOptions(screen.getByTestId('detail-stage-select'), 'won')
    expect(screen.getByTestId('detail-stage')).toHaveTextContent('won')
  })

  it('moving a deal updates the pipeline columns', async () => {
    const user = userEvent.setup()
    render(<App />)
    // d4 starts in lead
    await user.click(screen.getByTestId('open-d4'))
    await user.selectOptions(screen.getByTestId('detail-stage-select'), 'qualified')
    await user.click(screen.getByTestId('nav-pipeline'))
    expect(within(screen.getByTestId('column-qualified')).getByTestId('deal-d4')).toBeInTheDocument()
    expect(screen.getByTestId('column-lead-count')).toHaveTextContent('0')
    expect(screen.getByTestId('column-qualified-count')).toHaveTextContent('2')
  })

  it('moving to won updates the qualified value rollup', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-d1'))
    await user.selectOptions(screen.getByTestId('detail-stage-select'), 'won')
    await user.click(screen.getByTestId('nav-pipeline'))
    expect(screen.getByTestId('column-qualified-value')).toHaveTextContent('0')
    expect(screen.getByTestId('column-won-value')).toHaveTextContent('13000')
  })
})
