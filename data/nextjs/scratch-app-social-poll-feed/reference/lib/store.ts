import type { Poll } from './types'
import { sortByVotes } from './polls'

// In-memory server store for the API routes. SEPARATE from the client AppStateProvider
// state. Tests call __reset() in beforeEach so each test starts from the same seed.

let polls: Poll[] = []
let nextPollId = 1

function seed(): void {
  polls = [
    {
      id: 'q1',
      question: 'Best language?',
      options: [
        { id: 'q1-o1', label: 'Rust', votes: 5 },
        { id: 'q1-o2', label: 'Go', votes: 3 },
        { id: 'q1-o3', label: 'TS', votes: 7 },
      ],
      votedOptionId: null,
    },
    {
      id: 'q2',
      question: 'Tabs or spaces?',
      options: [
        { id: 'q2-o1', label: 'Tabs', votes: 2 },
        { id: 'q2-o2', label: 'Spaces', votes: 6 },
      ],
      votedOptionId: 'q2-o2',
    },
    {
      id: 'q3',
      question: 'Coffee or tea?',
      options: [
        { id: 'q3-o1', label: 'Coffee', votes: 4 },
        { id: 'q3-o2', label: 'Tea', votes: 4 },
      ],
      votedOptionId: null,
    },
  ]
  nextPollId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listPolls(filter?: { sort?: string | null }): Poll[] {
  if (filter?.sort === 'trending') return sortByVotes(polls)
  return polls.slice()
}

export function findPoll(id: string): Poll | undefined {
  return polls.find((p) => p.id === id)
}

export function createPoll(input: { question: string; options: string[] }): Poll | null {
  const question = input.question.trim()
  if (question.length === 0) return null
  const labels = input.options.map((l) => l.trim()).filter((l) => l.length > 0)
  if (labels.length < 2) return null
  const id = `q${nextPollId++}`
  const poll: Poll = {
    id,
    question,
    options: labels.map((label, i) => ({ id: `${id}-o${i + 1}`, label, votes: 0 })),
    votedOptionId: null,
  }
  polls.push(poll)
  return poll
}

export type VoteResult =
  | { ok: true; poll: Poll }
  | { ok: false; code: 404 | 400 | 409 }

export function votePoll(pollId: string, optionId: string): VoteResult {
  const poll = polls.find((p) => p.id === pollId)
  if (!poll) return { ok: false, code: 404 }
  if (poll.votedOptionId) return { ok: false, code: 409 }
  const option = poll.options.find((o) => o.id === optionId)
  if (!option) return { ok: false, code: 400 }
  option.votes += 1
  poll.votedOptionId = optionId
  return { ok: true, poll }
}

export function deletePoll(id: string): boolean {
  const idx = polls.findIndex((p) => p.id === id)
  if (idx === -1) return false
  polls.splice(idx, 1)
  return true
}
