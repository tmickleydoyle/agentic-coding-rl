'use client'
import { useState } from 'react'
import type { FormData } from './types'
import StepName from './StepName'
import StepEmail from './StepEmail'
import StepAge from './StepAge'

function isStepValid(step: number, data: FormData): boolean {
  if (step === 0) return data.name.trim().length > 0
  if (step === 1) return data.email.includes('@') && data.email.includes('.')
  return /^\d+$/.test(data.age) && Number(data.age) > 0
}

export default function Wizard() {
  const [data, setData] = useState<FormData>({ name: '', email: '', age: '' })
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof FormData) => (v: string) =>
    setData((prev) => ({ ...prev, [key]: v }))

  if (submitted) {
    return (
      <div data-testid="summary">
        <span>{data.name}</span>
        <span>{data.email}</span>
        <span>{data.age}</span>
      </div>
    )
  }

  const valid = isStepValid(step, data)

  return (
    <div>
      <span data-testid="step">{step + 1}</span>
      {step === 0 && <StepName value={data.name} onChange={set('name')} />}
      {step === 1 && <StepEmail value={data.email} onChange={set('email')} />}
      {step === 2 && <StepAge value={data.age} onChange={set('age')} />}
      <button data-testid="back" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
        Back
      </button>
      {step < 2 ? (
        <button data-testid="next" disabled={!valid} onClick={() => setStep((s) => s + 1)}>
          Next
        </button>
      ) : (
        <button data-testid="submit" disabled={!valid} onClick={() => setSubmitted(true)}>
          Submit
        </button>
      )}
    </div>
  )
}
