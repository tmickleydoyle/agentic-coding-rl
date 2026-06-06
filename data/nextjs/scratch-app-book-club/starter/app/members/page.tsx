'use client'
import React from 'react'
export function MembersPage() { return <div><h1>Members</h1><ul data-testid="member-list"></ul><form data-testid="add-member-form"><input data-testid="member-name-input" placeholder="Name"/><input data-testid="member-join-date-input" type="date"/><button data-testid="submit-member" type="submit">Add</button></form></div> }
