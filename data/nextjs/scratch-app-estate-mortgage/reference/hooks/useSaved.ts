'use client'
import { useMortgage } from '../components/AppStateProvider'
import { monthlyPayment } from '../lib/mortgage'
import type { Property } from '../lib/types'

export type Quote = {
  property: Property
  monthly: number
}

export function useSaved() {
  const { properties, saved, rate, termYears, downPayment } = useMortgage()
  const savedProperties = properties.filter((p) => saved.indexOf(p.id) !== -1)
  const quotes: Quote[] = savedProperties.map((property) => ({
    property,
    monthly: monthlyPayment({ price: property.price, downPayment, rate, termYears }),
  }))
  return { savedProperties, quotes }
}
