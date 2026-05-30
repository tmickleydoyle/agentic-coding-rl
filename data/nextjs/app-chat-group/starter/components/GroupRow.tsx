'use client'
import type { Group } from '../lib/types'

export default function GroupRow({
  group,
  onOpen,
}: {
  group: Group
  onOpen: (id: string) => void
}) {
  // TODO: render the group row with name, member count, and an open- button.
  void onOpen
  return <li data-testid={`group-${group.id}`} />
}
