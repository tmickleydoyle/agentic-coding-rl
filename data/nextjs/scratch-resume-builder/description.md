# Resume Builder

A single-page React app for building a resume with sections for personal info, experience, education, and skills.

## Seed Data

### Personal Info (pre-filled)
- name: "Jane Smith"
- email: "jane.smith@email.com"
- phone: "555-0101"
- location: "San Francisco, CA"
- summary: "Experienced software engineer with 5 years in web development"

### Experience (2 entries)
| id | company | title | startDate | endDate | description |
|----|---------|-------|-----------|---------|-------------|
| 1 | TechCorp | Senior Engineer | 2021-06 | Present | Led frontend team of 5 engineers |
| 2 | StartupXYZ | Engineer | 2019-01 | 2021-05 | Built React component library |

### Education (1 entry)
| id | institution | degree | field | graduationYear |
|----|-------------|--------|-------|----------------|
| 1 | State University | B.S. | Computer Science | 2018 |

### Skills (pre-loaded list)
- React, TypeScript, Node.js, CSS

## UI Layout

### Section: Personal Info
- Editable fields with labels: Name, Email, Phone, Location, Summary
- `data-testid` values: `input-name`, `input-email`, `input-phone`, `input-location`, `input-summary`
- "Save Info" button — `data-testid="save-info"`

### Section: Experience
- List of experience cards — `data-testid="exp-card-{id}"`
- Each card shows: company, title, startDate, endDate, description
- Delete button — `data-testid="delete-exp-{id}"`
- Add Experience form with fields: company, title, startDate, endDate, description
  - `data-testid`: `input-exp-company`, `input-exp-title`, `input-exp-start`, `input-exp-end`, `input-exp-desc`
  - Submit button — `data-testid="add-exp-btn"`

### Section: Education
- List of education cards — `data-testid="edu-card-{id}"`
- Each shows: institution, degree, field, graduationYear
- Delete button — `data-testid="delete-edu-{id}"`
- Add Education form with fields: institution, degree, field, graduationYear
  - `data-testid`: `input-edu-institution`, `input-edu-degree`, `input-edu-field`, `input-edu-year`
  - Submit button — `data-testid="add-edu-btn"`

### Section: Skills
- Display current skills as tags — `data-testid="skill-tag-{skill}"` (e.g., `skill-tag-React`)
- Input to add new skill — `data-testid="input-skill"`
- Add Skill button — `data-testid="add-skill-btn"`
- Each skill tag has remove button — `data-testid="remove-skill-{skill}"`

### Resume Preview
- A preview area — `data-testid="resume-preview"`
- Shows the name from personal info — `data-testid="preview-name"`
- Shows number of experience entries — `data-testid="preview-exp-count"`
- Shows number of skills — `data-testid="preview-skills-count"`

## Behaviors

1. **Save Info**: clicking Save Info persists personal info to the preview section.
2. **Add Experience**: submitting with company and title adds a new experience card.
3. **Delete Experience**: removes that experience entry.
4. **Add Education**: submitting with institution and degree adds a new education card.
5. **Delete Education**: removes that education entry.
6. **Add Skill**: typing in skill input and clicking Add Skill appends the skill tag; clears input.
7. **Remove Skill**: clicking remove on a skill tag removes it.
8. **Preview updates**: preview-name reflects saved name; preview-exp-count and preview-skills-count are live counts.

## Edge Cases

- Adding experience with empty company or title does nothing.
- Adding education with empty institution or degree does nothing.
- Adding a blank skill does nothing.
- Duplicate skills can be added (no deduplication required).
