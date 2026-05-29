'use client'
import { useState } from 'react'

export default function TwoStepForm() {
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState<{ name: string; email: string } | null>(null)

  if (submitted) {
    return (
      <p data-testid="status">
        Submitted: {submitted.name} / {submitted.email}
      </p>
    )
  }

  if (step === 1) {
    return (
      <div>
        <span data-testid="step">1</span>
        <input
          data-testid="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          data-testid="next"
          onClick={() => {
            if (name.trim() !== '') setStep(2)
          }}
        >
          Next
        </button>
      </div>
    )
  }

  // step 2
  return (
    <div>
      <span data-testid="step">2</span>
      <input
        data-testid="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button data-testid="back" onClick={() => setStep(1)}>
        Back
      </button>
      <button
        data-testid="submit"
        disabled={email.trim() === ''}
        onClick={() => setSubmitted({ name, email })}
      >
        Submit
      </button>
    </div>
  )
}
