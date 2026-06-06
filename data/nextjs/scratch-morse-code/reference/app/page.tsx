'use client'
import { useState } from 'react'

const MORSE: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
  G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..',
  M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
  S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
}

const REVERSE_MORSE: Record<string, string> = {}
Object.keys(MORSE).forEach(k => { REVERSE_MORSE[MORSE[k]] = k })

function textToMorse(text: string): string {
  const words = text.toUpperCase().split(/\s+/)
  const morseWords = words.map(word => {
    const chars: string[] = []
    for (let i = 0; i < word.length; i++) {
      const ch = word[i]
      if (MORSE[ch] !== undefined) {
        chars.push(MORSE[ch])
      }
    }
    return chars.join(' ')
  }).filter(w => w.length > 0)
  return morseWords.join(' / ')
}

function morseToText(morse: string): string {
  const words = morse.trim().split(' / ')
  const textWords = words.map(word => {
    const symbols = word.split(' ')
    return symbols.map(s => {
      if (!s) return ''
      return REVERSE_MORSE[s] !== undefined ? REVERSE_MORSE[s] : '?'
    }).join('')
  })
  return textWords.join(' ')
}

type Mode = 'text-to-morse' | 'morse-to-text'

const SEED_INPUT = 'Hello World'

export default function App() {
  const [mode, setMode] = useState<Mode>('text-to-morse')
  const [input, setInput] = useState(SEED_INPUT)
  const [output, setOutput] = useState(() => textToMorse(SEED_INPUT))

  function handleTranslate() {
    if (mode === 'text-to-morse') {
      setOutput(textToMorse(input))
    } else {
      setOutput(morseToText(input))
    }
  }

  function handleModeChange(newMode: Mode) {
    setMode(newMode)
    setInput('')
    setOutput('')
  }

  function handleClear() {
    setInput('')
    setOutput('')
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>
      <h1>Morse Code Translator</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button
          data-testid="mode-text-to-morse"
          onClick={() => handleModeChange('text-to-morse')}
          style={{ fontWeight: mode === 'text-to-morse' ? 'bold' : 'normal', marginRight: '0.5rem' }}
        >
          Text to Morse
        </button>
        <button
          data-testid="mode-morse-to-text"
          onClick={() => handleModeChange('morse-to-text')}
          style={{ fontWeight: mode === 'morse-to-text' ? 'bold' : 'normal' }}
        >
          Morse to Text
        </button>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="morse-input">Input</label>
        <br />
        <textarea
          id="morse-input"
          aria-label="Input"
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={4}
          style={{ width: '100%' }}
          placeholder={mode === 'text-to-morse' ? 'Enter text...' : 'Enter Morse code...'}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handleTranslate}>Translate</button>
        <button data-testid="clear-btn" onClick={handleClear} style={{ marginLeft: '0.5rem' }}>
          Clear
        </button>
      </div>
      <div>
        <strong>Output:</strong>
        <p data-testid="output" style={{ fontFamily: 'monospace', background: '#f4f4f4', padding: '0.5rem' }}>
          {output}
        </p>
      </div>
    </div>
  )
}
