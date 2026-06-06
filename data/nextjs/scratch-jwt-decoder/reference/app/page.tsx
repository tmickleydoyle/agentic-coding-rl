'use client'
import { useState } from 'react'

interface DecodedToken {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
}

function base64urlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '=='.slice(0, (4 - (base64.length % 4)) % 4)
  return atob(padded)
}

function decodeJwt(token: string): DecodedToken | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const header = JSON.parse(base64urlDecode(parts[0]))
    const payload = JSON.parse(base64urlDecode(parts[1]))
    return { header, payload, signature: parts[2] }
  } catch {
    return null
  }
}

export default function App() {
  const [tokenInput, setTokenInput] = useState('')
  const [decoded, setDecoded] = useState<DecodedToken | null>(null)
  const [isValid, setIsValid] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  function handleDecode() {
    const token = tokenInput.trim()
    if (!token) {
      setDecoded(null)
      setIsValid(false)
      return
    }
    const result = decodeJwt(token)
    if (result) {
      setDecoded(result)
      setIsValid(true)
      setHistory(prev => {
        const filtered = prev.filter(t => t !== token)
        return [token, ...filtered].slice(0, 3)
      })
    } else {
      setDecoded(null)
      setIsValid(false)
    }
  }

  function handleClear() {
    setTokenInput('')
    setDecoded(null)
    setIsValid(false)
  }

  function handleHistoryClick(token: string) {
    setTokenInput(token)
    const result = decodeJwt(token)
    if (result) {
      setDecoded(result)
      setIsValid(true)
    }
  }

  const alg = decoded ? (decoded.header['alg'] as string | undefined) ?? '-' : '-'
  const exp = decoded && typeof decoded.payload['exp'] === 'number'
    ? new Date((decoded.payload['exp'] as number) * 1000).toLocaleString()
    : 'No expiry'
  const iat = decoded && typeof decoded.payload['iat'] === 'number'
    ? new Date((decoded.payload['iat'] as number) * 1000).toLocaleString()
    : 'No iat'

  return (
    <div>
      <h1>JWT Decoder</h1>

      <label>
        JWT Token
        <textarea
          value={tokenInput}
          onChange={e => setTokenInput(e.target.value)}
          rows={4}
          style={{ display: 'block', width: '100%' }}
        />
      </label>

      <button onClick={handleDecode}>Decode</button>
      <button onClick={handleClear}>Clear</button>

      <div>
        <span>Status: </span>
        <span data-testid="token-valid">{isValid ? 'Valid' : 'Invalid'}</span>
        <span> | Algorithm: </span>
        <span data-testid="token-alg">{alg}</span>
        <span> | Expires: </span>
        <span data-testid="token-exp">{exp}</span>
        <span> | Issued At: </span>
        <span data-testid="token-iat">{iat}</span>
      </div>

      <div>
        <h2>Header</h2>
        <pre data-testid="header-output">
          {decoded ? JSON.stringify(decoded.header, null, 2) : ''}
        </pre>
      </div>

      <div>
        <h2>Payload</h2>
        <pre data-testid="payload-output">
          {decoded ? JSON.stringify(decoded.payload, null, 2) : ''}
        </pre>
      </div>

      <div>
        <h2>Signature</h2>
        <pre data-testid="signature-output">
          {decoded ? decoded.signature : ''}
        </pre>
      </div>

      {history.length > 0 && (
        <div>
          <h2>History</h2>
          <ul>
            {history.map((token, i) => (
              <li
                key={i}
                data-testid="history-item"
                onClick={() => handleHistoryClick(token)}
                style={{ cursor: 'pointer', wordBreak: 'break-all' }}
              >
                {token.slice(0, 40)}...
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
