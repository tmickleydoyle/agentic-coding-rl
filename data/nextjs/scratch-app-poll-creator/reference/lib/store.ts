import { Poll, Vote } from './types'

const SEED_POLLS: Poll[] = [
  { id: 'p1', question: 'Best programming language?', options: ['Python', 'TypeScript', 'Rust'] },
  { id: 'p2', question: 'Preferred work style?', options: ['Remote', 'Hybrid', 'Office'] },
  { id: 'p3', question: 'Favorite season?', options: ['Spring', 'Summer', 'Fall', 'Winter'] },
]

const SEED_VOTES: Vote[] = [
  { id: 'v1', pollId: 'p1', option: 'TypeScript' },
  { id: 'v2', pollId: 'p1', option: 'Python' },
  { id: 'v3', pollId: 'p1', option: 'TypeScript' },
  { id: 'v4', pollId: 'p2', option: 'Remote' },
  { id: 'v5', pollId: 'p2', option: 'Remote' },
  { id: 'v6', pollId: 'p2', option: 'Hybrid' },
]

let polls: Poll[] = SEED_POLLS.map(p => ({ ...p, options: [...p.options] }))
let votes: Vote[] = SEED_VOTES.map(v => ({ ...v }))

export function getPolls(): Poll[] { return [...polls] }

export function addPoll(data: { question: string; options: string[] }): Poll {
  const p: Poll = { id: `p${Date.now()}`, ...data }
  polls.push(p)
  return p
}

export function getVotes(): Vote[] { return [...votes] }

export function addVote(data: { pollId: string; option: string }): Vote {
  const v: Vote = { id: `v${Date.now()}`, ...data }
  votes.push(v)
  return v
}

export function __reset(): void {
  polls = SEED_POLLS.map(p => ({ ...p, options: [...p.options] }))
  votes = SEED_VOTES.map(v => ({ ...v }))
}
