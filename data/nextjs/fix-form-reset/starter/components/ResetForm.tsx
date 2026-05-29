'use client'
import { useState, FormEvent } from 'react'

type Errors = { name?: string; age?: string }

export default function ResetForm() {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next: Errors = {}
    if (name.trim() === '') next.name = 'Name is required.'
    const ageNum = Number(age)
    if (age.trim() === '' || Number.isNaN(ageNum) || ageNum < 18) {
      next.age = 'Must be 18 or older.'
    }
    setErrors(next)
  }

  const onReset = () => {
    setName('')
    setAge('')
  }

  return (
    <form onSubmit={onSubmit}>
      <input data-testid="name" value={name} onChange={(e) => setName(e.target.value)} />
      {errors.name && <p data-testid="name-error">{errors.name}</p>}
      <input data-testid="age" value={age} onChange={(e) => setAge(e.target.value)} />
      {errors.age && <p data-testid="age-error">{errors.age}</p>}
      <button data-testid="submit" type="submit">
        Submit
      </button>
      <button data-testid="reset" type="button" onClick={onReset}>
        Reset
      </button>
    </form>
  )
}
