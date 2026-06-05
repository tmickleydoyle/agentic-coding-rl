'use client'
import { useApp } from '../../components/AppStateProvider'
import WordRow from '../../components/WordRow'

export default function WordsPage() {
  const { words, wordIndex, pick } = useApp()
  return (
    <section data-testid="page-words">
      <h1>Words</h1>
      <ul data-testid="word-list">
        {words.map((w, i) => (
          <WordRow
            key={i}
            index={i}
            word={w}
            current={i === wordIndex}
            onPick={pick}
          />
        ))}
      </ul>
    </section>
  )
}
