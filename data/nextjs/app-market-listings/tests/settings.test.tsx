import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../app/page'

describe('theme root', () => {
  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
