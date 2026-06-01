'use client'
import type { Env } from '../lib/types'

export default function EnvToggle({
  env,
  enabled,
  onToggle,
}: {
  env: Env
  enabled: boolean
  onToggle: (env: Env) => void
}) {
  return (
    <div data-testid={`env-row-${env}`} data-enabled={enabled ? 'true' : 'false'}>
      <span data-testid={`env-row-${env}-name`}>{env}</span>
      <button data-testid={`toggle-${env}`} onClick={() => onToggle(env)}>
        {enabled ? 'Disable' : 'Enable'}
      </button>
    </div>
  )
}
