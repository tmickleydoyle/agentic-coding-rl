'use client'
import type { Member } from '../lib/types'

export default function MemberRow({ member }: { member: Member }) {
  return (
    <li data-testid={`member-${member.id}`}>
      <span data-testid={`member-${member.id}-name`}>{member.name}</span>
      <span data-testid={`member-${member.id}-handle`}>{member.handle}</span>
    </li>
  )
}
