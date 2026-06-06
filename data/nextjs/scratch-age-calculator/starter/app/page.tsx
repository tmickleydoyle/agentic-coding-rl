'use client'
import { useState } from 'react'

export default function App() {
  const [birthDate, setBirthDate] = useState('')
  const [asOfDate, setAsOfDate] = useState('')

  return (
    <div>
      <h1>Age Calculator</h1>
      <div data-testid="age-years">--</div>
      <div data-testid="age-months">--</div>
      <div data-testid="age-days">--</div>
      <div data-testid="age-summary">--</div>
      <div data-testid="next-birthday">--</div>
    </div>
  )
}
