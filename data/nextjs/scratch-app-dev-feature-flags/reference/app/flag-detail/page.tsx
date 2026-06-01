'use client'
import { useState } from 'react'
import { useFlags } from '../../components/AppStateProvider'
import EnvToggle from '../../components/EnvToggle'
import { ENVS } from '../../lib/types'

export default function FlagDetailPage() {
  const { flags, selectedId, toggleEnv, setRollout } = useFlags()
  const [rolloutInput, setRolloutInput] = useState('')

  if (!selectedId) {
    return (
      <section data-testid="page-flag-detail">
        <p data-testid="no-selection">Select a flag to see its detail.</p>
      </section>
    )
  }

  const flag = flags.find((f) => f.id === selectedId)
  if (!flag) {
    return (
      <section data-testid="page-flag-detail">
        <p data-testid="no-selection">Flag not found.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-flag-detail">
      <h2 data-testid="detail-key">{flag.key}</h2>
      <div data-testid="env-toggles">
        {ENVS.map((env) => (
          <EnvToggle
            key={env}
            env={env}
            enabled={flag.envs[env]}
            onToggle={(e) => toggleEnv(flag.id, e)}
          />
        ))}
      </div>
      <p data-testid="detail-rollout">{flag.rollout}</p>
      <input
        data-testid="rollout-input"
        type="number"
        value={rolloutInput}
        onChange={(e) => setRolloutInput(e.target.value)}
      />
      <button
        data-testid="set-rollout"
        onClick={() => setRollout(flag.id, Number(rolloutInput))}
      >
        Set rollout
      </button>
    </section>
  )
}
