'use client'
import { useState } from 'react'
import type { TreeNode } from './types'

export default function TreeNodeView({ node }: { node: TreeNode }) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = !!node.children && node.children.length > 0

  return (
    <li data-testid={`node-${node.id}`}>
      <span data-testid={`label-${node.id}`}>{node.label}</span>
      {hasChildren && (
        <button data-testid={`toggle-${node.id}`} onClick={() => setExpanded((e) => !e)}>
          {expanded ? '-' : '+'}
        </button>
      )}
      {hasChildren && expanded && (
        <ul data-testid={`children-${node.id}`}>
          {node.children!.map((child) => (
            <TreeNodeView key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  )
}
