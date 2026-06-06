'use client'
import { useState } from 'react'

interface Member {
  id: number
  name: string
  title: string
  managerId: number | null
}

const SEED: Member[] = [
  { id: 1, name: 'Sandra Hill',  title: 'CEO',               managerId: null },
  { id: 2, name: 'Tom Baker',    title: 'VP Engineering',    managerId: 1 },
  { id: 3, name: 'Lisa Park',    title: 'VP Marketing',      managerId: 1 },
  { id: 4, name: 'James Wu',     title: 'Lead Engineer',     managerId: 2 },
  { id: 5, name: 'Mia Torres',   title: 'Frontend Dev',      managerId: 4 },
  { id: 6, name: 'Nina Scott',   title: 'Backend Dev',       managerId: 4 },
  { id: 7, name: 'Oliver Reyes', title: 'Marketing Analyst', managerId: 3 },
]

interface TreeNodeProps {
  member: Member
  members: Member[]
  collapsed: Record<number, boolean>
  onToggle: (id: number) => void
}

function TreeNode({ member, members, collapsed, onToggle }: TreeNodeProps) {
  const children = members.filter(m => m.managerId === member.id)
  const isCollapsed = collapsed[member.id] || false

  return (
    <li data-testid="org-node">
      <span data-testid="org-name">{member.name}</span>
      {' — '}
      <span data-testid="org-title">{member.title}</span>
      {children.length > 0 && (
        <button data-testid="org-toggle" onClick={() => onToggle(member.id)}>
          {isCollapsed ? '+' : '-'}
        </button>
      )}
      {children.length > 0 && !isCollapsed && (
        <ul>
          {children.map(child => (
            <TreeNode key={child.id} member={child} members={members} collapsed={collapsed} onToggle={onToggle} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function App() {
  const [members, setMembers] = useState<Member[]>(SEED.map(m => ({ ...m })))
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({})
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [managerId, setManagerId] = useState<string>('')
  const [nextId, setNextId] = useState(8)

  function handleToggle(id: number) {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function handleAdd() {
    if (!name.trim() || !title.trim() || !managerId) return
    setMembers(prev => [...prev, { id: nextId, name: name.trim(), title: title.trim(), managerId: Number(managerId) }])
    setNextId(n => n + 1)
    setName(''); setTitle(''); setManagerId('')
    setShowForm(false)
  }

  function handleCancel() {
    setName(''); setTitle(''); setManagerId('')
    setShowForm(false)
  }

  const roots = members.filter(m => m.managerId === null)

  return (
    <div>
      <h1>Org Chart</h1>

      <p data-testid="member-count">Members: {members.length}</p>

      <button onClick={() => setShowForm(f => !f)}>Add Member</button>

      {showForm && (
        <div data-testid="add-form">
          <input aria-label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
          <input aria-label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
          <select aria-label="Manager" value={managerId} onChange={e => setManagerId(e.target.value)}>
            <option value="">-- Select Manager --</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <button onClick={handleAdd}>Add</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}

      <ul>
        {roots.map(root => (
          <TreeNode key={root.id} member={root} members={members} collapsed={collapsed} onToggle={handleToggle} />
        ))}
      </ul>
    </div>
  )
}
