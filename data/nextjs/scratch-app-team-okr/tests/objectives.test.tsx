import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('objectives and detail', () => {
  it('lists objectives with rolled-up progress', () => {
    render(<App />)
    expect(screen.getByTestId('objective-o1-title')).toHaveTextContent('Grow revenue')
    expect(screen.getByTestId('objective-o1-owner')).toHaveTextContent('Ada')
    expect(screen.getByTestId('objective-o1-progress')).toHaveTextContent('60')
    expect(screen.getByTestId('objective-o2-progress')).toHaveTextContent('100')
  })

  it('opens an objective detail with its key results', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-o1'))
    expect(screen.getByTestId('page-objective-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Grow revenue')
    expect(screen.getByTestId('detail-progress')).toHaveTextContent('60')
    expect(screen.getByTestId('kr-kr1')).toBeInTheDocument()
    expect(screen.getByTestId('kr-kr2-progress')).toHaveTextContent('80')
  })

  it('updates a key result progress and recomputes the objective rollup', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-o1'))
    fireEvent.change(screen.getByTestId('kr-kr1-input'), { target: { value: '100' } })
    expect(screen.getByTestId('kr-kr1-progress')).toHaveTextContent('100')
    // (100 + 80) / 2 = 90
    expect(screen.getByTestId('detail-progress')).toHaveTextContent('90')
  })

  it('reflects updated progress back on the objectives list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-o1'))
    fireEvent.change(screen.getByTestId('kr-kr1-input'), { target: { value: '0' } })
    await user.click(screen.getByTestId('nav-objectives'))
    // (0 + 80) / 2 = 40
    expect(screen.getByTestId('objective-o1-progress')).toHaveTextContent('40')
  })

  it('clamps key result progress above 100', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-o2'))
    fireEvent.change(screen.getByTestId('kr-kr3-input'), { target: { value: '150' } })
    expect(screen.getByTestId('kr-kr3-progress')).toHaveTextContent('100')
  })
})
