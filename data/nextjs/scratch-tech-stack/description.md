# Tech Stack

A single-page app to manage and categorize your personal tech stack.

## Seed Data (6 technologies)

| Name | Category | Tags | Description | Proficiency |
|------|----------|------|-------------|-------------|
| TypeScript | Language | frontend, backend | Typed superset of JavaScript | expert |
| React | Frontend | frontend, ui | UI component library | expert |
| PostgreSQL | Database | backend, database | Relational database | intermediate |
| Docker | DevOps | backend, devops | Container platform | intermediate |
| Tailwind CSS | Frontend | frontend, ui | Utility-first CSS framework | expert |
| Python | Language | backend, scripting | General purpose language | intermediate |

## Fields

Each tech entry has:
- `id`: unique number
- `name`: string
- `category`: string
- `tags`: string[] (array of tag strings)
- `description`: string
- `proficiency`: "beginner" | "intermediate" | "expert"

## UI Layout

- Page heading: "My Tech Stack"
- Summary stats:
  - Total technologies count in data-testid="total-count"
  - Expert count in data-testid="expert-count"
  - Intermediate count in data-testid="intermediate-count"
  - Beginner count in data-testid="beginner-count"
- Category filter: select with data-testid="filter-category" with "All" + unique categories
- Proficiency filter: select with data-testid="filter-proficiency" with "All" + "beginner", "intermediate", "expert"
- Tag search: text input with data-testid="search-tag" that filters by tag (substring match)
- Tech list: each item in a div with data-testid="tech-item"
  - Name in data-testid="tech-name"
  - Category in data-testid="tech-category"
  - Tags displayed as comma-separated list in data-testid="tech-tags"
  - Description in data-testid="tech-description"
  - Proficiency badge in data-testid="tech-proficiency"
- Add Tech form:
  - Text input, label "Name", data-testid="input-name"
  - Text input, label "Category", data-testid="input-category"
  - Text input, label "Tags (comma-separated)", data-testid="input-tags"
  - Textarea, label "Description", data-testid="input-description"
  - Select, label "Proficiency", data-testid="input-proficiency" options: beginner, intermediate, expert
  - Submit button: "Add Technology"
- Each tech item has a "Remove" button with data-testid="remove-tech-btn"

## Behaviors

- Category filter and proficiency filter work together (AND logic)
- Tag search filters items where any tag contains the search string (case-insensitive)
- All three filters are applied simultaneously
- Summary counts always reflect the FULL dataset, not filtered view
- Tags input is comma-split and trimmed when adding a new tech
- Adding appends to list and clears the form
- Removing deletes from dataset
- If no items match current filters, show div with data-testid="empty-message"

## Edge Cases

- Name must be non-empty to submit
- Category filter dropdown updates when new entries are added (no duplicates)
- Empty tag search string matches all items
- Tags display as comma-separated (e.g., "frontend, backend")
