import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GreetByTime from '../components/GreetByTime'

const cases: [number, string][] = [
  [0,  'Good night'],
  [4,  'Good night'],
  [5,  'Good morning'],
  [9,  'Good morning'],
  [11, 'Good morning'],
  [12, 'Good afternoon'],
  [16, 'Good afternoon'],
  [17, 'Good evening'],
  [21, 'Good evening'],
  [22, 'Good night'],
  [23, 'Good night'],
]

describe('GreetByTime', () => {
  for (const [hour, expected] of cases) {
    it(`hour=${hour} → "${expected}"`, () => {
      render(<GreetByTime hour={hour} />)
      expect(screen.getByTestId('greeting')).toHaveTextContent(expected)
    })
  }
})
