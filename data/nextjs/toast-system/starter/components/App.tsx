'use client'
import { useToast } from '../hooks/useToast'
import { ToastContext } from './ToastContext'
import ToastList from './ToastList'

// TODO: instantiate useToast() and provide it via ToastContext.Provider; render
// show-hi/show-bye buttons + ToastList.
export default function App() {
  const api = useToast()
  return (
    <ToastContext.Provider value={api}>
      <button data-testid="show-hi">Show hi</button>
      <button data-testid="show-bye">Show bye</button>
      <ToastList />
    </ToastContext.Provider>
  )
}
