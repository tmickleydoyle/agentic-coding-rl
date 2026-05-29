'use client'
import type { TreeNode } from './types'
import TreeNodeView from './TreeNodeView'

// TODO: render <ul data-testid="tree"> with one TreeNodeView per root node.
export default function Tree({ roots }: { roots: TreeNode[] }) {
  return <ul data-testid="tree" />
}
