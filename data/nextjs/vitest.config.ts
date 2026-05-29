import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Tests are run by pointing vitest at /tmp/_acrl_run via --root. The setup file is
// copied alongside (validate.sh + gen_synthetic._validate do this) so this path
// resolves relative to the workdir root.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    pool: 'forks',
  },
})
