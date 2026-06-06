# Project Gallery

Build a single-page project gallery where a creator can showcase their projects.

## Seed Data

Start with these 4 projects pre-loaded:

| id | title             | description                        | tags              | featured |
|----|-------------------|------------------------------------|-------------------|----------|
| 1  | Neon City         | A vibrant digital cityscape        | digital,neon      | true     |
| 2  | Forest Sounds     | Ambient audio installation         | audio,nature      | false    |
| 3  | Paper Worlds      | Hand-crafted paper dioramas        | craft,paper       | true     |
| 4  | Data Portraits    | Generative art from personal data  | generative,data   | false    |

## Fields per Project

- `id` — unique number
- `title` — string
- `description` — string
- `tags` — array of strings
- `featured` — boolean

## Layout & Components

### Header
- `<h1>` with text "Project Gallery"
- Show project count: `data-testid="project-count"` — text "{n} projects"

### Filter Bar
- Text input `data-testid="filter-input"` — filters by title (case-insensitive substring)
- A checkbox `data-testid="filter-featured"` labeled "Featured Only" — when checked shows only featured projects

### Project List
- Each project in a card `data-testid="project-card"`
  - `data-testid="project-title"` — title
  - `data-testid="project-description"` — description
  - `data-testid="project-tags"` — comma-joined tags string (e.g. "digital,neon")
  - `data-testid="project-featured"` — text "Featured" if featured, "Standard" if not
  - Button `data-testid="toggle-featured"` — text "Feature" when not featured, "Unfeature" when featured. Clicking toggles.
  - Button `data-testid="delete-project"` — removes the project

### Add Project Form
- `data-testid="add-form"`
- Inputs:
  - `data-testid="input-title"` — text, placeholder "Title"
  - `data-testid="input-description"` — text, placeholder "Description"
  - `data-testid="input-tags"` — text, placeholder "Tags (comma-separated)"
  - `data-testid="input-featured"` — checkbox labeled "Featured"
- Submit button `data-testid="submit-project"` — "Add Project"
- On submit: add project with new unique id, split tags string by comma and trim each tag, clear form
- Validation: if title or description is empty, do NOT add, show `data-testid="form-error"` with text "Title and description are required."

## Behaviors

- project-count shows total (not filtered) count
- Both filters can be active simultaneously
- Filters apply in real time
