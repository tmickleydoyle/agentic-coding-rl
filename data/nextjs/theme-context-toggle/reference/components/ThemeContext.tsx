'use client'
import { createContext, useContext } from 'react'

export type ThemeValue = { theme: 'light' | 'dark'; toggle: () => void }

export const ThemeContext = createContext<ThemeValue>({ theme: 'light', toggle: () => {} })

export function useTheme() {
  return useContext(ThemeContext)
}
