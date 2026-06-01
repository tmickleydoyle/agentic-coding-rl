import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../app/page'

describe('theme on root', () => {
  it('defaults to light theme reflected on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
