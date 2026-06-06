'use client'
import { useState } from 'react'

const SEED = '{"name":"Alice","age":30,"hobbies":["reading","coding"]}'

function getStatus(input: string): string {
  if (!input.trim()) return ''
  try {
    JSON.parse(input)
    return 'Valid JSON'
  } catch {
    return 'Invalid JSON'
  }
}

function getIndent(indentOption: string): string | number {
  if (indentOption === '4 spaces') return 4
  if (indentOption === 'Tab') return '\t'
  return 2
}

export default function App() {
  const [input, setInput] = useState(SEED)
  const [output, setOutput] = useState('')
  const [indent, setIndent] = useState('2 spaces')
  const [copied, setCopied] = useState(false)

  const status = getStatus(input)

  function handleFormat() {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, getIndent(indent)))
    } catch {
      // status already shows Invalid JSON
    }
  }

  function handleMinify() {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
    } catch {
      // status already shows Invalid JSON
    }
  }

  function handleClear() {
    setInput('')
    setOutput('')
    setCopied(false)
  }

  function handleInputChange(val: string) {
    setInput(val)
    setCopied(false)
  }

  async function handleCopy() {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
  }

  return (
    <div>
      <h1>JSON Formatter</h1>

      <label>
        Input JSON
        <textarea
          aria-label="Input JSON"
          value={input}
          onChange={e => handleInputChange(e.target.value)}
        />
      </label>

      <p data-testid="status">{status}</p>

      <div>
        <label>
          Indent
          <select
            aria-label="Indent"
            value={indent}
            onChange={e => setIndent(e.target.value)}
          >
            <option value="2 spaces">2 spaces</option>
            <option value="4 spaces">4 spaces</option>
            <option value="Tab">Tab</option>
          </select>
        </label>
      </div>

      <div>
        <button onClick={handleFormat}>Format</button>
        <button onClick={handleMinify}>Minify</button>
        <button onClick={handleClear}>Clear</button>
      </div>

      <label>
        Output JSON
        <textarea
          aria-label="Output JSON"
          readOnly
          value={output}
        />
      </label>

      <button onClick={handleCopy}>Copy Output</button>
      {copied && <span data-testid="copy-indicator">Copied!</span>}
    </div>
  )
}
