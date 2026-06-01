'use client'
import { useState } from 'react'

type Item = { id: number; name: string; price: number; qty: number }
const SEED: Item[] = [
  { id: 1, name: 'Notebook', price: 12, qty: 2 },
  { id: 2, name: 'Pen', price: 3, qty: 1 },
]
const STEPS = ['Cart', 'Shipping', 'Payment', 'Review']

function money(n: number) {
  return `$${n.toFixed(2)}`
}

export default function App() {
  const [step, setStep] = useState(0)
  const [placed, setPlaced] = useState(false)
  const [items, setItems] = useState<Item[]>(SEED.map((i) => ({ ...i })))

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')

  const [card, setCard] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = items.length === 0 ? 0 : subtotal >= 50 ? 0 : 5.99
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const total = subtotal + shipping + tax

  const shippingValid =
    name.trim() !== '' && address.trim() !== '' && city.trim() !== '' && /^\d{5}$/.test(zip)
  const paymentValid =
    /^\d{16}$/.test(card) &&
    cardName.trim() !== '' &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    /^\d{3}$/.test(cvc)

  const stepValid = [items.length > 0, shippingValid, paymentValid, true][step]

  function setQty(id: number, delta: number) {
    setItems((xs) =>
      xs.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)),
    )
  }
  function removeItem(id: number) {
    setItems((xs) => xs.filter((i) => i.id !== id))
  }

  if (placed) {
    return (
      <div>
        <h2>Order confirmed</h2>
        <p>{`Total paid: ${money(total)}`}</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Checkout</h1>
      <h2>{STEPS[step]}</h2>
      <p>{`Step ${step + 1} of ${STEPS.length}`}</p>

      {step === 0 && (
        <div>
          <ul>
            {items.map((i) => (
              <li key={i.id}>
                <span>{`${i.name} — ${money(i.price)} × ${i.qty}`}</span>
                <button aria-label={`Decrease ${i.name}`} onClick={() => setQty(i.id, -1)}>
                  -
                </button>
                <button aria-label={`Increase ${i.name}`} onClick={() => setQty(i.id, 1)}>
                  +
                </button>
                <button aria-label={`Remove ${i.name}`} onClick={() => removeItem(i.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p>{`Subtotal: ${money(subtotal)}`}</p>
        </div>
      )}

      {step === 1 && (
        <div>
          <input aria-label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input aria-label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <input aria-label="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <input aria-label="ZIP code" value={zip} onChange={(e) => setZip(e.target.value)} />
        </div>
      )}

      {step === 2 && (
        <div>
          <input aria-label="Card number" value={card} onChange={(e) => setCard(e.target.value)} />
          <input
            aria-label="Name on card"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
          />
          <input aria-label="Expiry" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
          <input aria-label="CVC" value={cvc} onChange={(e) => setCvc(e.target.value)} />
        </div>
      )}

      {step === 3 && (
        <div>
          <p>{`Subtotal: ${money(subtotal)}`}</p>
          <p>{`Shipping: ${shipping === 0 ? 'Free' : money(shipping)}`}</p>
          <p>{`Tax: ${money(tax)}`}</p>
          <p>{`Total: ${money(total)}`}</p>
        </div>
      )}

      <div>
        {step > 0 && <button onClick={() => setStep((s) => s - 1)}>Back</button>}
        {step < STEPS.length - 1 && (
          <button disabled={!stepValid} onClick={() => setStep((s) => s + 1)}>
            Continue
          </button>
        )}
        {step === STEPS.length - 1 && <button onClick={() => setPlaced(true)}>Place order</button>}
      </div>
    </div>
  )
}
