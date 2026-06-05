import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('funnel computation', () => {
  it('shows step counts for the all segment by default', () => {
    render(<App />)
    expect(screen.getByTestId('frow-st1-count')).toHaveTextContent('1000')
    expect(screen.getByTestId('frow-st2-count')).toHaveTextContent('500')
    expect(screen.getByTestId('frow-st4-count')).toHaveTextContent('120')
  })

  it('computes drop-off percentages between steps', () => {
    render(<App />)
    // first step has 0 drop-off
    expect(screen.getByTestId('frow-st1-dropoff')).toHaveTextContent('0')
    // signup: (1000-500)/1000 = 50
    expect(screen.getByTestId('frow-st2-dropoff')).toHaveTextContent('50')
    // activate: (500-300)/500 = 40
    expect(screen.getByTestId('frow-st3-dropoff')).toHaveTextContent('40')
    // purchase: (300-120)/300 = 60
    expect(screen.getByTestId('frow-st4-dropoff')).toHaveTextContent('60')
  })

  it('shows the overall conversion for the all segment', () => {
    render(<App />)
    // 120 / 1000 = 12
    expect(screen.getByTestId('overall-conversion')).toHaveTextContent('12')
  })

  it('recomputes counts and drop-offs for the mobile segment', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('segment-filter'), 'mobile')
    expect(screen.getByTestId('frow-st1-count')).toHaveTextContent('600')
    // signup: (600-250)/600 = 58.33 -> 58
    expect(screen.getByTestId('frow-st2-dropoff')).toHaveTextContent('58')
    // overall: 40/600 = 6.67 -> 7
    expect(screen.getByTestId('overall-conversion')).toHaveTextContent('7')
  })

  it('recomputes for the desktop segment', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('segment-filter'), 'desktop')
    expect(screen.getByTestId('frow-st1-count')).toHaveTextContent('400')
    // overall: 80/400 = 20
    expect(screen.getByTestId('overall-conversion')).toHaveTextContent('20')
  })
})
