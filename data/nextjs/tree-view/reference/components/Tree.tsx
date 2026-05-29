'use client'
import type { TreeNode } from './types'
import TreeNodeView from './TreeNodeView'

export default function Tree({ roots }: { roots: TreeNode[] }) {
  return (
    <ul data-testid="tree">
      {roots.map((node) => (
        <TreeNodeView key={node.id} node={node} />
      ))}
    </ul>
  )
}
