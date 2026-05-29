import { useEffect, useRef, useState } from 'react'
import type { Fetcher, Option } from '../components/types'

export function useCombobox(fetchOptions: Fetcher, delay: number) {
  const [query, setQueryState] = useState('')
  const [options, setOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const seq = useRef(0)
  // when true, the next query change came from selecting and must not fetch
  const skipFetch = useRef(false)

  useEffect(() => {
    return () => {
      if (timer.current !== null) clearTimeout(timer.current)
    }
  }, [])

  const runFetch = (q: string) => {
    const myId = ++seq.current
    setLoading(true)
    setError(null)
    fetchOptions(q)
      .then((opts) => {
        if (myId !== seq.current) return // stale
        setOptions(opts)
        setLoading(false)
        setError(null)
      })
      .catch((e: unknown) => {
        if (myId !== seq.current) return // stale
        setError(e instanceof Error ? e.message : String(e))
        setOptions([])
        setLoading(false)
      })
  }

  const setQuery = (value: string) => {
    setQueryState(value)
    setOpen(true)
    setHighlight(0)
    if (timer.current !== null) clearTimeout(timer.current)

    if (skipFetch.current) {
      skipFetch.current = false
      return
    }

    if (value.trim() === '') {
      // cancel any in-flight result and reset
      seq.current++
      setOptions([])
      setLoading(false)
      setError(null)
      return
    }

    timer.current = setTimeout(() => {
      runFetch(value)
    }, delay)
  }

  const moveDown = () => {
    if (options.length === 0) return
    setHighlight((h) => (h + 1) % options.length)
  }
  const moveUp = () => {
    if (options.length === 0) return
    setHighlight((h) => (h - 1 + options.length) % options.length)
  }

  const select = (opt: Option) => {
    if (timer.current !== null) clearTimeout(timer.current)
    skipFetch.current = true
    setQueryState(opt.label)
    setOpen(false)
  }

  const choose = () => {
    if (!open || options.length === 0) return
    select(options[highlight])
  }

  const selectAt = (id: string) => {
    const opt = options.find((o) => o.id === id)
    if (opt) select(opt)
  }

  return {
    query,
    setQuery,
    options,
    loading,
    error,
    open,
    highlight,
    moveUp,
    moveDown,
    choose,
    selectAt,
  }
}
