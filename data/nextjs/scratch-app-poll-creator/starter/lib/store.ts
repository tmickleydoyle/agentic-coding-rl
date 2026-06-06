import { Poll, Vote } from './types'
export function getPolls(): Poll[] { return [] }
export function addPoll(_d: { question: string; options: string[] }): Poll { return { id: '', question: '', options: [] } }
export function getVotes(): Vote[] { return [] }
export function addVote(_d: { pollId: string; option: string }): Vote { return { id: '', pollId: '', option: '' } }
export function __reset(): void {}
