'use client'
import { useState } from 'react'

const SEED_ORIGINAL = `Hello World
This is line two
This line will be removed
Same line here`

const SEED_MODIFIED = `Hello World
This is line two
Same line here
This line was added`

type DiffRow = { type: 'same' | 'added' | 'removed'; text: string }

function computeDiff(original: string, modified: string): DiffRow[] {
  const aLines = original === '' ? [] : original.split('\n')
  const bLines = modified === '' ? [] : modified.split('\n')

  // Build LCS table
  const m = aLines.length
  const n = bLines.length
  const dp: number[][] = []
  for (let i = 0; i <= m; i++) {
    dp[i] = []
    for (let j = 0; j <= n; j++) {
      dp[i][j] = 0
    }
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (aLines[i - 1] === bLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack
  const result: DiffRow[] = []
  let i = m
  let j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
      result.unshift({ type: 'same', text: aLines[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', text: bLines[j - 1] })
      j--
    } else {
      result.unshift({ type: 'removed', text: aLines[i - 1] })
      i--
    }
  }
  return result
}

export default function App() {
  const [original, setOriginal] = useState(SEED_ORIGINAL)
  const [modified, setModified] = useState(SEED_MODIFIED)
  const [diff, setDiff] = useState<DiffRow[]>(() => computeDiff(SEED_ORIGINAL, SEED_MODIFIED))
  const [hasCompared, setHasCompared] = useState(true)

  function handleCompare() {
    if (original.trim() === '' && modified.trim() === '') {
      setDiff([])
      setHasCompared(false)
      return
    }
    setDiff(computeDiff(original, modified))
    setHasCompared(true)
  }

  const added = diff.filter(r => r.type === 'added').length
  const removed = diff.filter(r => r.type === 'removed').length
  const same = diff.filter(r => r.type === 'same').length

  const showEmpty = !hasCompared && original.trim() === '' && modified.trim() === ''

  return (
    <div style={{ fontFamily: 'monospace', padding: '1rem' }}>
      <h1>Diff Viewer</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="original-text">Original Text</label>
          <textarea
            id="original-text"
            aria-label="Original Text"
            placeholder="Enter original text..."
            value={original}
            onChange={e => setOriginal(e.target.value)}
            rows={8}
            style={{ width: '100%', display: 'block' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="modified-text">Modified Text</label>
          <textarea
            id="modified-text"
            aria-label="Modified Text"
            placeholder="Enter modified text..."
            value={modified}
            onChange={e => setModified(e.target.value)}
            rows={8}
            style={{ width: '100%', display: 'block' }}
          />
        </div>
      </div>
      <button onClick={handleCompare}>Compare</button>

      <div style={{ marginTop: '1rem' }}>
        {showEmpty ? (
          <p data-testid="diff-empty">No input to compare.</p>
        ) : (
          <>
            <p data-testid="diff-summary">
              {added} added, {removed} removed, {same} unchanged
            </p>
            <div>
              {diff.map((row, idx) => {
                const bg =
                  row.type === 'added'
                    ? '#d4edda'
                    : row.type === 'removed'
                    ? '#f8d7da'
                    : 'transparent'
                const prefix = row.type === 'added' ? '+' : row.type === 'removed' ? '-' : ' '
                const testIds: Record<string, string> = {
                  added: 'diff-added',
                  removed: 'diff-removed',
                  same: 'diff-same',
                }
                return (
                  <div
                    key={idx}
                    data-testid="diff-row"
                    style={{ backgroundColor: bg, padding: '2px 4px' }}
                  >
                    <span data-testid={testIds[row.type]}>
                      {prefix} {row.text}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
