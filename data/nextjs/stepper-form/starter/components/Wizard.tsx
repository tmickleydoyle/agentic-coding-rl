'use client'
import { useState } from 'react'
import type { FormData } from './types'
import StepName from './StepName'
import StepEmail from './StepEmail'
import StepAge from './StepAge'

// TODO: hold the full FormData (fields start '') and the current step (0..2, start 0). Render only
// the current step's subcomponent and <span data-testid="step">{step+1}</span>. Render
// <button data-testid="back"> (disabled on step 0, goes back, preserving values). On steps 0/1 a
// <button data-testid="next"> disabled unless the current step is valid; on step 2 a
// <button data-testid="submit"> disabled unless step 2 valid. After submit, render
// <div data-testid="summary"> with name/email/age and hide the inputs/nav.
// Validity: step0 name non-empty (trimmed); step1 email has '@' and '.'; step2 age positive integer.
export default function Wizard() {
  const [data, setData] = useState<FormData>({ name: '', email: '', age: '' })
  const [step, setStep] = useState(0)
  return (
    <div>
      <span data-testid="step">{step + 1}</span>
      {step === 0 && <StepName value={data.name} onChange={() => {}} />}
    </div>
  )
}
