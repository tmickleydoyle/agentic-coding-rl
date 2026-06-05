'use client'
import { useState } from 'react'

const PLANS = [
  { label: 'Starter', price: 9 },
  { label: 'Professional', price: 29 },
  { label: 'Enterprise', price: 99 },
]

const ADDONS = [
  { label: 'Extra Storage', price: 5 },
  { label: 'Priority Support', price: 10 },
  { label: 'Advanced Analytics', price: 15 },
]

export default function App() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState(0)
  const [checkedAddons, setCheckedAddons] = useState<boolean[]>([false, false, false])

  function toggleAddon(i: number) {
    setCheckedAddons((prev) => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })
  }

  const base = PLANS[selectedPlan].price
  const addonsTotal = ADDONS.reduce((sum, a, i) => sum + (checkedAddons[i] ? a.price : 0), 0)
  const subtotal = base + addonsTotal
  const total = billing === 'annual' ? subtotal * 0.9 : subtotal
  const totalStr = total.toFixed(2)

  const totalLine =
    billing === 'annual'
      ? `Total: $${totalStr} per month (10% annual discount applied)`
      : `Total: $${totalStr} per month`

  return (
    <div>
      <h1>Pricing Configurator</h1>

      <section aria-label="Billing">
        <h2>Billing</h2>
        <button
          aria-pressed={billing === 'monthly'}
          onClick={() => setBilling('monthly')}
        >
          Monthly
        </button>
        <button
          aria-pressed={billing === 'annual'}
          onClick={() => setBilling('annual')}
        >
          Annual
        </button>
      </section>

      <section aria-label="Base Plan">
        <h2>Base Plan</h2>
        {PLANS.map((plan, i) => (
          <label key={plan.label}>
            <input
              type="radio"
              name="base-plan"
              value={plan.label}
              checked={selectedPlan === i}
              onChange={() => setSelectedPlan(i)}
            />
            {` ${plan.label} ($${plan.price})`}
          </label>
        ))}
      </section>

      <section aria-label="Add-ons">
        <h2>Add-ons</h2>
        {ADDONS.map((addon, i) => (
          <label key={addon.label}>
            <input
              type="checkbox"
              checked={checkedAddons[i]}
              onChange={() => toggleAddon(i)}
            />
            {` ${addon.label} ($${addon.price})`}
          </label>
        ))}
      </section>

      <p>{totalLine}</p>
    </div>
  )
}
