'use client'
import { ReactNode } from 'react'
import { ThemeContext } from './ThemeContext'

// TODO: hold theme in state; implement toggle; provide via ThemeContext.Provider.
export default function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value={{ theme: 'light', toggle: () => {} }}>{children}</ThemeContext.Provider>
}
