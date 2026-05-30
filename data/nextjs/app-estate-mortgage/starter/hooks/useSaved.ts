'use client'
import { useMortgage } from '../components/AppStateProvider'
import type { Property } from '../lib/types'

export type Quote = {
  property: Property
  monthly: number
}

export function useSaved() {
  const { properties, saved } = useMortgage()
  void properties
  void saved
  // TODO: derive savedProperties and per-property monthly quotes from the shared loan params
  const savedProperties: Property[] = []
  const quotes: Quote[] = []
  return { savedProperties, quotes }
}
