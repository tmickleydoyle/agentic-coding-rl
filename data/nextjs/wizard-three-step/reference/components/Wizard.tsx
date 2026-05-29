'use client'
import { useState } from 'react'

export default function Wizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  if (done) return <p data-testid="status">Done</p>

  const currentEmpty =
    (step === 1 && name.trim() === '') || (step === 2 && email.trim() === '')

  return (
    <div>
      <span data-testid="step">{step}</span>
      {step === 1 && (
        <input
          data-testid="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      {step === 2 && (
        <input
          data-testid="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}
      {step === 3 && (
        <>
          <p data-testid="summary">{name} · {email}</p>
          <button data-testid="submit" onClick={() => setDone(true)}>Submit</button>
        </>
      )}
      <button
        data-testid="back"
        disabled={step === 1}
        onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))}
      >
        Back
      </button>
      {step < 3 && (
        <button
          data-testid="next"
          disabled={currentEmpty}
          onClick={() => setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s))}
        >
          Next
        </button>
      )}
    </div>
  )
}
