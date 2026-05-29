'use client'
import { useState } from 'react'
import type { TreeNode } from './types'

// TODO: render <li data-testid="node-<id>"> with <span data-testid="label-<id>">. If the node
// has children, render a <button data-testid="toggle-<id>"> showing '-' when expanded and '+'
// when collapsed (start collapsed), and when expanded a nested <ul data-testid="children-<id>">
// of TreeNodeView per child. Leaf nodes render no toggle and no child <ul>.
export default function TreeNodeView({ node }: { node: TreeNode }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <li data-testid={`node-${node.id}`}>
      <span data-testid={`label-${node.id}`}>{node.label}</span>
    </li>
  )
}
