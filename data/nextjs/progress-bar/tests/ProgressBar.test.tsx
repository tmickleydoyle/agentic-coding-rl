import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProgressBar from '../components/ProgressBar'

describe('ProgressBar', () => {
  it('starts at 0%', () => {
    render(<ProgressBar />)
    expect(screen.getByTestId('progress-value')).toHaveTextContent('0%')
  })

  it('progress bar starts with width 0%', () => {
    render(<ProgressBar />)
    expect(screen.getByTestId('progress-bar')).toHaveStyle({ width: '0%' })
  })

  it('increases by 10 on click', async () => {
    const user = userEvent.setup()
    render(<ProgressBar />)
    await user.click(screen.getByTestId('increase-btn'))
    expect(screen.getByTestId('progress-value')).toHaveTextContent('10%')
  })

  it('progress bar width updates after increase', async () => {
    const user = userEvent.setup()
    render(<ProgressBar />)
    await user.click(screen.getByTestId('increase-btn'))
    expect(screen.getByTestId('progress-bar')).toHaveStyle({ width: '10%' })
  })

  it('does not go below 0', async () => {
    const user = userEvent.setup()
    render(<ProgressBar />)
    await user.click(screen.getByTestId('decrease-btn'))
    expect(screen.getByTestId('progress-value')).toHaveTextContent('0%')
  })

  it('does not exceed 100', async () => {
    const user = userEvent.setup()
    render(<ProgressBar />)
    for (let i = 0; i < 12; i++) {
      await user.click(screen.getByTestId('increase-btn'))
    }
    expect(screen.getByTestId('progress-value')).toHaveTextContent('100%')
  })

  it('decreases after increasing', async () => {
    const user = userEvent.setup()
    render(<ProgressBar />)
    await user.click(screen.getByTestId('increase-btn'))
    await user.click(screen.getByTestId('increase-btn'))
    await user.click(screen.getByTestId('decrease-btn'))
    expect(screen.getByTestId('progress-value')).toHaveTextContent('10%')
  })
})
