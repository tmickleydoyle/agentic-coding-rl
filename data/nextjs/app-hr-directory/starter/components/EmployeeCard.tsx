'use client'
import type { Employee } from '../lib/types'

export default function EmployeeCard(_props: { employee: Employee; onOpen: (id: string) => void }) {
  // TODO: render emp-<id> with -name/-title/-dept and an open-<id> button
  return <li data-testid={`emp-${_props.employee.id}`} />
}
