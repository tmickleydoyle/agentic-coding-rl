'use client'
import { useState } from 'react'
import { useShop } from '../../components/AppStateProvider'
import { useCheckout } from '../../hooks/useCheckout'
import CouponCard from '../../components/CouponCard'

export default function CouponsPage() {
  const { coupons, appliedCode, applyCode, clearCoupon } = useShop()
  const { couponValid, couponMessage } = useCheckout()
  const [input, setInput] = useState('')
  const [unknown, setUnknown] = useState(false)

  const onApply = () => {
    const trimmed = input.trim()
    applyCode(trimmed)
    const found = coupons.some((c) => c.code === trimmed.toUpperCase())
    setUnknown(trimmed.length > 0 && !found)
  }

  const onClear = () => {
    clearCoupon()
    setUnknown(false)
    setInput('')
  }

  return (
    <section data-testid="page-coupons">
      <h1>Coupons</h1>
      <ul data-testid="coupon-list">
        {coupons.map((c) => (
          <CouponCard key={c.code} coupon={c} />
        ))}
      </ul>
      <input
        data-testid="code-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button data-testid="apply-code" onClick={onApply}>
        Apply
      </button>
      <button data-testid="clear-coupon" onClick={onClear}>
        Clear
      </button>
      {unknown ? <p data-testid="applied-error">Unknown code</p> : null}
      {!unknown && appliedCode && couponValid ? (
        <p data-testid="applied-ok">Applied {appliedCode}</p>
      ) : null}
      {!unknown && appliedCode && !couponValid ? (
        <p data-testid="applied-warn">{couponMessage}</p>
      ) : null}
    </section>
  )
}
