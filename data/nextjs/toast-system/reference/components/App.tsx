'use client'
import { useToast } from '../hooks/useToast'
import { ToastContext } from './ToastContext'
import ToastList from './ToastList'

export default function App() {
  const api = useToast()
  return (
    <ToastContext.Provider value={api}>
      <button data-testid="show-hi" onClick={() => api.show('hi')}>Show hi</button>
      <button data-testid="show-bye" onClick={() => api.show('bye')}>Show bye</button>
      <ToastList />
    </ToastContext.Provider>
  )
}
