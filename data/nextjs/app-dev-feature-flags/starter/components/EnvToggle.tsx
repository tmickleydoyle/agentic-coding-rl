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
  // TODO: render an env-row-<env> (data-enabled) with a toggle-<env> button
  void onToggle
  return <div data-testid={`env-row-${env}`} data-enabled={enabled ? 'true' : 'false'} />
}
