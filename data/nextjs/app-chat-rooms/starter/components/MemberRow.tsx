'use client'
import type { Member } from '../lib/types'

export default function MemberRow({ member }: { member: Member }) {
  // TODO: render the member row with name and handle.
  return <li data-testid={`member-${member.id}`} />
}
