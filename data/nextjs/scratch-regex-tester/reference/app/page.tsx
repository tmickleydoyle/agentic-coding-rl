'use client'
import { useState, useEffect } from 'react'

const SEED_PATTERN = '\\d+'
const SEED_TEXT = 'Order 123 was placed on 2024-01-15 for $456.78'

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

interface TestResult {
  count: string
  html: string
  matches: string[]
}

function runTest(pattern: string, text: string, flagG: boolean, flagI: boolean, flagM: boolean): TestResult {
  if (!pattern) {
    return { count: 'No matches', html: escapeHtml(text), matches: [] }
  }
  let flags = ''
  if (flagG) flags += 'g'
  if (flagI) flags += 'i'
  if (flagM) flags += 'm'

  let re: RegExp
  try {
    re = new RegExp(pattern, flags)
  } catch {
    return { count: 'Invalid regex', html: escapeHtml(text), matches: [] }
  }

  const allMatches: RegExpExecArray[] = []
  if (flagG) {
    let m: RegExpExecArray | null
    re.lastIndex = 0
    while ((m = re.exec(text)) !== null) {
      allMatches.push(m)
      if (m[0].length === 0) re.lastIndex++
    }
  } else {
    const m = re.exec(text)
    if (m) allMatches.push(m)
  }

  if (allMatches.length === 0) {
    return { count: 'No matches', html: escapeHtml(text), matches: [] }
  }

  // Build highlighted HTML
  let html = ''
  let cursor = 0
  allMatches.forEach(m => {
    const start = m.index
    const end = start + m[0].length
    html += escapeHtml(text.slice(cursor, start))
    html += `<mark data-testid="match-highlight">${escapeHtml(m[0])}</mark>`
    cursor = end
  })
  html += escapeHtml(text.slice(cursor))

  return {
    count: `${allMatches.length} match(es)`,
    html,
    matches: allMatches.map(m => m[0]),
  }
}

export default function App() {
  const [pattern, setPattern] = useState(SEED_PATTERN)
  const [testStr, setTestStr] = useState(SEED_TEXT)
  const [flagG, setFlagG] = useState(true)
  const [flagI, setFlagI] = useState(false)
  const [flagM, setFlagM] = useState(false)
  const [result, setResult] = useState<TestResult>({ count: '', html: '', matches: [] })

  useEffect(() => {
    setResult(runTest(SEED_PATTERN, SEED_TEXT, true, false, false))
  }, [])

  function handleTest() {
    setResult(runTest(pattern, testStr, flagG, flagI, flagM))
  }

  return (
    <div>
      <h1>Regex Tester</h1>

      <div>
        <label>
          Pattern
          <input
            aria-label="Pattern"
            type="text"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          <input
            aria-label="Global (g)"
            type="checkbox"
            checked={flagG}
            onChange={e => setFlagG(e.target.checked)}
          />
          Global (g)
        </label>
        <label>
          <input
            aria-label="Case Insensitive (i)"
            type="checkbox"
            checked={flagI}
            onChange={e => setFlagI(e.target.checked)}
          />
          Case Insensitive (i)
        </label>
        <label>
          <input
            aria-label="Multiline (m)"
            type="checkbox"
            checked={flagM}
            onChange={e => setFlagM(e.target.checked)}
          />
          Multiline (m)
        </label>
      </div>

      <div>
        <label>
          Test String
          <textarea
            aria-label="Test String"
            value={testStr}
            onChange={e => setTestStr(e.target.value)}
          />
        </label>
      </div>

      <button onClick={handleTest}>Test</button>

      <p data-testid="match-count">{result.count}</p>

      <div
        data-testid="result-area"
        dangerouslySetInnerHTML={{ __html: result.html }}
      />

      <ul>
        {result.matches.map((m, i) => (
          <li key={i} data-testid="match-item">{m}</li>
        ))}
      </ul>
    </div>
  )
}
