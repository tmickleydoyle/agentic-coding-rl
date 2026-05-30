'use client'
import type { Person } from '../lib/types'

export default function MemberItem({
  person,
  isAdmin,
  onRemove,
}: {
  person: Person
  isAdmin: boolean
  onRemove: (id: string) => void
}) {
  // TODO: render the member row with name and a remove- button (none for the admin).
  void isAdmin
  void onRemove
  return <li data-testid={`member-${person.id}`} />
}
