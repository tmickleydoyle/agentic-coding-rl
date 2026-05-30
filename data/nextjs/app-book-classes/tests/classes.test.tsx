import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('classes list', () => {
  it('lists classes with capacity and enrolled counts', () => {
    render(<App />)
    expect(screen.getByTestId('class-c1-name')).toHaveTextContent('Yoga')
    expect(screen.getByTestId('class-c1-capacity')).toHaveTextContent('2')
    expect(screen.getByTestId('class-c1-enrolled')).toHaveTextContent('1') // Ada
    expect(screen.getByTestId('class-c2-enrolled')).toHaveTextContent('1') // Grace
  })

  it('marks a full class as full and an open one as not full', () => {
    render(<App />)
    // c2 (Pottery) capacity 1 is full; c1 (Yoga) has room
    expect(screen.getByTestId('class-c2-full')).toHaveAttribute('data-full', 'true')
    expect(screen.getByTestId('class-c1-full')).toHaveAttribute('data-full', 'false')
  })

  it('opens a class detail from the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    expect(screen.getByTestId('page-class-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Yoga')
    expect(screen.getByTestId('detail-capacity')).toHaveTextContent('2')
  })
})
