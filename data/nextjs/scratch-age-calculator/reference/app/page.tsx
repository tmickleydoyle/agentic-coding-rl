'use client'
import { useState } from 'react'

function todayStr(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function calcAge(birthStr: string, asOfStr: string) {
  if (!birthStr || !asOfStr) return null
  const b = new Date(birthStr + 'T00:00:00')
  const a = new Date(asOfStr + 'T00:00:00')
  if (isNaN(b.getTime()) || isNaN(a.getTime())) return null
  if (b > a) return null

  let years = a.getFullYear() - b.getFullYear()
  let months = a.getMonth() - b.getMonth()
  let days = a.getDate() - b.getDate()

  if (days < 0) {
    months -= 1
    const prevMonth = new Date(a.getFullYear(), a.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }

  return { years, months, days }
}

function nextBirthday(birthStr: string, asOfStr: string): string {
  if (!birthStr || !asOfStr) return '--'
  const b = new Date(birthStr + 'T00:00:00')
  const a = new Date(asOfStr + 'T00:00:00')
  if (isNaN(b.getTime()) || isNaN(a.getTime())) return '--'

  let next = new Date(a.getFullYear(), b.getMonth(), b.getDate())
  if (next < a) {
    next = new Date(a.getFullYear() + 1, b.getMonth(), b.getDate())
  }

  if (
    next.getFullYear() === a.getFullYear() &&
    next.getMonth() === a.getMonth() &&
    next.getDate() === a.getDate()
  ) {
    return 'Today!'
  }

  return next.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function App() {
  const [birthDate, setBirthDate] = useState('')
  const [asOfDate, setAsOfDate] = useState(todayStr())

  function reset() {
    setBirthDate('')
    setAsOfDate(todayStr())
  }

  const age = calcAge(birthDate, asOfDate)
  const nb = nextBirthday(birthDate, asOfDate)

  return (
    <div>
      <h1>Age Calculator</h1>

      <div>
        <label htmlFor="birth-date">Birth Date</label>
        <input
          id="birth-date"
          aria-label="Birth Date"
          type="date"
          value={birthDate}
          onChange={e => setBirthDate(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="as-of-date">As Of Date</label>
        <input
          id="as-of-date"
          aria-label="As Of Date"
          type="date"
          value={asOfDate}
          onChange={e => setAsOfDate(e.target.value)}
        />
      </div>

      <div>
        <span>Years:</span>
        <span data-testid="age-years">{age !== null ? age.years : '--'}</span>
      </div>
      <div>
        <span>Months:</span>
        <span data-testid="age-months">{age !== null ? age.months : '--'}</span>
      </div>
      <div>
        <span>Days:</span>
        <span data-testid="age-days">{age !== null ? age.days : '--'}</span>
      </div>
      <div>
        <span>Age:</span>
        <span data-testid="age-summary">
          {age !== null
            ? `${age.years} years, ${age.months} months, ${age.days} days`
            : '--'}
        </span>
      </div>
      <div>
        <span>Next Birthday:</span>
        <span data-testid="next-birthday">{nb}</span>
      </div>

      <button onClick={reset}>Reset</button>
    </div>
  )
}
