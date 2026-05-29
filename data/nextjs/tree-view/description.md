# Collapsible tree view

This task spans **3 files**. Render a nested tree where each node may have children, and each
node with children can be expanded/collapsed independently.

- `components/types.ts` — exports `type TreeNode = { id: string; label: string; children?: TreeNode[] }`.
- `components/TreeNodeView.tsx` — accepts `{ node: TreeNode }`. Renders
  `<li data-testid="node-<id>">` containing:
  - a `<span data-testid="label-<id>">{label}</span>`.
  - if and only if the node has a non-empty `children` array, a
    `<button data-testid="toggle-<id>">` whose text is `-` when expanded and `+` when collapsed
    (nodes start **collapsed**). Clicking it toggles this node's expanded state.
  - when expanded, a nested `<ul data-testid="children-<id>">` containing one `TreeNodeView` per
    child. When collapsed, that `<ul>` (and therefore all descendants) must be **absent** from the DOM.
  - leaf nodes (no children) render no toggle button and no child `<ul>`.
- `components/Tree.tsx` (entry, default export) — accepts `{ roots: TreeNode[] }`. Renders a top-level
  `<ul data-testid="tree">` containing one `TreeNodeView` per root node.

Expanded state is **per node** (expanding one node does not expand its siblings or its parent's other
subtrees). Manage each node's own expanded state within `TreeNodeView`.
