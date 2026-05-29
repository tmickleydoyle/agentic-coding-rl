'use client'
import { useState } from 'react'

export default function Picker({ options }: { options: string[] }) {
  // TODO: controlled <select>; data-testid="picked" shows current value.
  return (
    <div>
      <select data-testid="select"></select>
      <span data-testid="picked"></span>
    </div>
  )
}
