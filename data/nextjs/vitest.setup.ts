import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Vitest + Testing Library doesn't auto-cleanup between `it()` blocks unless globals=true.
// Without this, mounted components accumulate and queries like getByRole find duplicates.
afterEach(() => cleanup())
