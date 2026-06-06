'use client'
import { useState } from 'react'

interface AccordionItemProps {
  title: string
  content: string
}

export default function AccordionItem({ title, content: _content }: AccordionItemProps) {
  const [_isOpen] = useState(false)

  return (
    <div>
      <button data-testid="accordion-toggle">
        + {title}
      </button>
    </div>
  )
}
