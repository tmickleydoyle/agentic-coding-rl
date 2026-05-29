'use client'
import { useState } from 'react'
import type { Card, ColumnIndex } from './types'
import { COLUMN_NAMES } from './types'
import Column from './Column'

// TODO: all cards start in column 0. Track each card's column in state. onMove(id, dir)
// shifts that card's column by dir, clamped to 0..2. Render the three Columns in order,
// each given only the cards currently in that column (preserving initialCards order).
export default function Board({ initialCards }: { initialCards: Card[] }) {
  return <div />
}
