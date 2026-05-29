# Nested comment thread

This task spans **4 files**. Comments form a tree: each comment can have replies, and each
comment has its own reply box that appends a child comment.

- `components/types.ts` — exports `type Comment = { id: number; text: string; replies: Comment[] }`.
- `hooks/useThread.ts` — exports `useThread(initial: Comment[])` returning `{ comments, addReply, addRoot }`:
  - `comments: Comment[]` — the current top-level comments.
  - `addRoot(text: string): void` — appends a new top-level comment (empty `replies`) with a unique
    numeric id.
  - `addReply(parentId: number, text: string): void` — appends a new reply (unique id, empty `replies`)
    to the `replies` of the comment with `parentId`, **anywhere in the tree** (recursive search).
  Ids must be unique across the whole tree; new comments always get a fresh id greater than any
  existing one.
- `components/Comment.tsx` — accepts `{ comment: Comment; onReply: (parentId: number, text: string) => void }`.
  Renders `<li data-testid="comment-<id>">` with a `<span data-testid="text-<id>">{text}</span>`, a
  reply form containing `<input data-testid="reply-input-<id>">` and
  `<button data-testid="reply-btn-<id>">Reply</button>`, and — if the comment has replies — a nested
  `<ul data-testid="replies-<id>">` rendering each reply via `Comment` recursively. Clicking Reply with
  a non-empty (after trim) input calls `onReply(comment.id, text)` and clears the input; an empty/
  whitespace input does nothing.
- `components/Thread.tsx` (entry, default export) — accepts `{ initial?: Comment[] }` (default `[]`).
  Uses `useThread`. Renders a top-level `<ul data-testid="thread">` of root `Comment`s, plus a root
  reply box: `<input data-testid="root-input">` and `<button data-testid="root-btn">Add</button>` that
  calls `addRoot(text)` for non-empty input and clears the field.
