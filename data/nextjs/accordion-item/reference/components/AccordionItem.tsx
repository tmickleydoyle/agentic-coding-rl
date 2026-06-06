'use client'
import { useState } from 'react'

interface AccordionItemProps {
  title: string
  content: string
}

export default function AccordionItem({ title, content }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button
        data-testid="accordion-toggle"
        onClick={() => setIsOpen(prev => !prev)}
      >
        {isOpen ? '-' : '+'} {title}
      </button>
      {isOpen && (
        <div data-testid="accordion-content">
          {content}
        </div>
      )}
    </div>
  )
}
