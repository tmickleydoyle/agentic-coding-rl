import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('roadmap and detail', () => {
  it('shows per-quarter counts', () => {
    render(<App />)
    expect(screen.getByTestId('quarter-q1-count')).toHaveTextContent('2')
    expect(screen.getByTestId('quarter-q2-count')).toHaveTextContent('1')
    expect(screen.getByTestId('quarter-q3-count')).toHaveTextContent('0')
  })

  it('places cards under their quarter with status attribute', () => {
    render(<App />)
    const q1 = screen.getByTestId('quarter-q1')
    expect(within(q1).getByTestId('card-i1')).toBeInTheDocument()
    expect(within(q1).getByTestId('card-i2')).toBeInTheDocument()
    expect(screen.getByTestId('card-i1')).toHaveAttribute('data-status', 'in-progress')
    expect(screen.getByTestId('card-i3')).toHaveAttribute('data-status', 'done')
  })

  it('opens an initiative detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-i1'))
    expect(screen.getByTestId('page-initiative-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Launch beta')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('in-progress')
  })

  it('changes status from the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-i2'))
    await user.selectOptions(screen.getByTestId('status-select'), 'done')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('done')
    await user.click(screen.getByTestId('nav-roadmap'))
    expect(screen.getByTestId('card-i2')).toHaveAttribute('data-status', 'done')
  })

  it('moves an initiative to a different quarter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-i1'))
    await user.selectOptions(screen.getByTestId('quarter-select'), 'q3')
    await user.click(screen.getByTestId('nav-roadmap'))
    expect(screen.getByTestId('quarter-q1-count')).toHaveTextContent('1')
    expect(screen.getByTestId('quarter-q3-count')).toHaveTextContent('1')
    expect(within(screen.getByTestId('quarter-q3')).getByTestId('card-i1')).toBeInTheDocument()
  })
})
