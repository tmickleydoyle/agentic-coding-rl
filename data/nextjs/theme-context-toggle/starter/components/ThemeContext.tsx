'use client'
import { createContext, useContext } from 'react'

// TODO: shape { theme: 'light' | 'dark'; toggle: () => void }
export const ThemeContext = createContext({ theme: 'light', toggle: () => {} })

export function useTheme() {
  return useContext(ThemeContext)
}
