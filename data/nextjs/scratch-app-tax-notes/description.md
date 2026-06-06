# scratch-app-tax-notes

## Overview
A tax notes organizer with 4 routes: Overview, Documents, Deductions, and Notes.

## Routes
- **Overview** (`overview`): Shows total deductions, estimated tax year, number of documents logged.
- **Documents** (`documents`): List tax documents (name, type, year, amount). Add/delete documents.
- **Deductions** (`deductions`): List deductions (description, amount, category). Add/delete deductions.
- **Notes** (`notes`): Free-form tax notes (title, content, date). Add/delete notes.

## Seed Data
Documents:
- { id: "doc1", name: "W-2 Employer", type: "w2", year: 2023, amount: 75000 }
- { id: "doc2", name: "1099-INT Bank", type: "1099", year: 2023, amount: 250 }

Deductions:
- { id: "ded1", description: "Home Office", amount: 1500, category: "business" }
- { id: "ded2", description: "Charitable Donations", amount: 800, category: "charitable" }
- { id: "ded3", description: "Medical Expenses", amount: 2200, category: "medical" }

Notes:
- { id: "n1", title: "Deadline Reminder", content: "File by April 15", date: "2024-01-01" }

## Fields
- Document: id, name, type (w2|1099|1098|schedule_c|other), year, amount
- Deduction: id, description, amount, category (business|charitable|medical|education|other)
- Note: id, title, content, date

## Behaviors
- Total deductions = sum of all deduction amounts
- Overview shows total deductions, doc count, current tax year (2023)
- Filtering deductions by category shows subset
