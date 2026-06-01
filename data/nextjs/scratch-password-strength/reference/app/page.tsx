'use client'
import { useState } from 'react'

function checkRules(password: string) {
  return {
    length: password.length >= 8,
    number: /[0-9]/.test(password),
    symbol: /[^a-zA-Z0-9]/.test(password),
    mixedCase: /[A-Z]/.test(password) && /[a-z]/.test(password),
  }
}

function getStrength(passed: number): string {
  if (passed <= 1) return 'Weak'
  if (passed <= 3) return 'Medium'
  return 'Strong'
}

export default function App() {
  const [password, setPassword] = useState('')

  const rules = checkRules(password)
  const ruleList = [
    { label: 'At least 8 characters', passed: rules.length },
    { label: 'Contains a number', passed: rules.number },
    { label: 'Contains a symbol', passed: rules.symbol },
    { label: 'Contains uppercase and lowercase', passed: rules.mixedCase },
  ]
  const passedCount = ruleList.filter((r) => r.passed).length
  const strength = getStrength(passedCount)

  return (
    <div>
      <h1>Password Strength Checker</h1>
      <div>
        <label htmlFor="password-input">Password</label>
        <input
          id="password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <ul>
        {ruleList.map((rule) => (
          <li key={rule.label} aria-label={rule.passed ? 'pass' : 'fail'}>
            {rule.label}
          </li>
        ))}
      </ul>
      <div>{`Strength: ${strength}`}</div>
    </div>
  )
}
