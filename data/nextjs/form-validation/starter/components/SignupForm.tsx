'use client'
import { useState } from 'react'

export default function SignupForm() {
  // TODO: implement controlled inputs, on-submit validation, error rendering, and
  // status text per description.md. Error elements must be ABSENT from the DOM until
  // submit reveals a failing field.
  return (
    <form>
      <input data-testid="email" />
      <input data-testid="password" type="password" />
      <button data-testid="submit" type="submit">
        Sign up
      </button>
      <p data-testid="status"></p>
    </form>
  )
}
