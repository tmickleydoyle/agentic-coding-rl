'use client'
import type { Reply } from '../lib/types'

export default function ReplyItem({ reply }: { reply: Reply }) {
  // TODO: render the reply row with text.
  return <li data-testid={`reply-${reply.id}`} />
}
