'use client'
import { useState } from 'react'

type Poll = { id: number; question: string; options: string[]; votes: number[]; voted: boolean }

const SEED: Poll[] = [
  {
    id: 1,
    question: 'Best language?',
    options: ['Python', 'JavaScript', 'Rust'],
    votes: [3, 1, 0],
    voted: false,
  },
]

function pct(count: number, total: number) {
  return total === 0 ? 0 : Math.round((count / total) * 100)
}

export default function App() {
  const [polls, setPolls] = useState<Poll[]>(SEED.map((p) => ({ ...p, votes: [...p.votes] })))
  const [question, setQuestion] = useState('')
  const [option, setOption] = useState('')
  const [pending, setPending] = useState<string[]>([])
  const [nextId, setNextId] = useState(2)

  function addOption() {
    const o = option.trim()
    if (!o) return
    setPending((p) => [...p, o])
    setOption('')
  }

  function createPoll() {
    if (question.trim() === '' || pending.length < 2) return
    setPolls((ps) => [
      ...ps,
      {
        id: nextId,
        question: question.trim(),
        options: [...pending],
        votes: pending.map(() => 0),
        voted: false,
      },
    ])
    setNextId((n) => n + 1)
    setQuestion('')
    setOption('')
    setPending([])
  }

  function vote(pollId: number, optIdx: number) {
    setPolls((ps) =>
      ps.map((p) => {
        if (p.id !== pollId || p.voted) return p
        const votes = p.votes.map((v, i) => (i === optIdx ? v + 1 : v))
        return { ...p, votes, voted: true }
      }),
    )
  }

  const canCreate = question.trim() !== '' && pending.length >= 2

  return (
    <div>
      <h1>Polls</h1>

      <section aria-label="Create poll">
        <h2>Create a poll</h2>
        <input aria-label="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <input aria-label="Option" value={option} onChange={(e) => setOption(e.target.value)} />
        <button onClick={addOption}>Add option</button>
        <ul>
          {pending.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
        <button disabled={!canCreate} onClick={createPoll}>
          Create poll
        </button>
      </section>

      {polls.map((p) => {
        const total = p.votes.reduce((s, v) => s + v, 0)
        return (
          <section key={p.id} aria-label={p.question}>
            <h2>{p.question}</h2>
            {p.options.map((opt, oi) => {
              const share = pct(p.votes[oi], total)
              return (
                <div key={opt}>
                  <button
                    aria-label={`Vote for ${opt}`}
                    disabled={p.voted}
                    onClick={() => vote(p.id, oi)}
                  >
                    Vote
                  </button>
                  <span>{`${opt}: ${p.votes[oi]} (${share}%)`}</span>
                  <div
                    role="progressbar"
                    aria-label={`${opt} share`}
                    aria-valuenow={share}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    style={{ width: `${share}%` }}
                  />
                </div>
              )
            })}
            <p>{`Total votes: ${total}`}</p>
          </section>
        )
      })}
    </div>
  )
}
