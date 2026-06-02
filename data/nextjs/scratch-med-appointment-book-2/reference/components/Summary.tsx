'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { appointments } = useApp()
  const total = appointments.length
  const booked = appointments.filter((a) => a.status === 'booked').length
  const done = appointments.filter((a) => a.status === 'done').length
  const noShow = appointments.filter((a) => a.status === 'no-show').length
  const rate = total === 0 ? 0 : Math.round((noShow / total) * 100)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Booked: ${booked}`}</p>
      <p>{`Done: ${done}`}</p>
      <p>{`No-show: ${noShow}`}</p>
      <p>{`No-show rate: ${rate}%`}</p>
    </section>
  )
}
