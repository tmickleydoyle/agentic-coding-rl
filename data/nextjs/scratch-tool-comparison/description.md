# Tool Comparison

A single-page app to compare developer tools side by side across multiple criteria.

## Seed Data (4 tools, 4 criteria)

Tools:
| Name | Category | Website |
|------|----------|---------|
| GitHub Actions | CI/CD | github.com |
| CircleCI | CI/CD | circleci.com |
| GitLab CI | CI/CD | gitlab.com |
| Jenkins | CI/CD | jenkins.io |

Criteria scores (1-10 scale):
| Tool | Ease of Use | Performance | Cost | Community |
|------|-------------|-------------|------|-----------|
| GitHub Actions | 9 | 8 | 7 | 10 |
| CircleCI | 7 | 9 | 6 | 8 |
| GitLab CI | 8 | 8 | 8 | 7 |
| Jenkins | 5 | 7 | 10 | 9 |

## Fields

Each tool has:
- `id`: unique number
- `name`: string
- `category`: string
- `website`: string
- `scores`: Record<string, number> — keys are criterion names, values 1-10

Criteria are stored as a separate array of strings: ["Ease of Use", "Performance", "Cost", "Community"]

## UI Layout

- Page heading: "Tool Comparison"
- Comparison table:
  - data-testid="comparison-table"
  - Header row: "Tool" + one column per criterion + "Average"
  - Each tool row: data-testid="tool-row"
    - Tool name in data-testid="tool-name"
    - Score per criterion in data-testid="score-{criterionIndex}" (e.g., score-0, score-1)
    - Average score (mean of all criteria) in data-testid="tool-average" shown to 1 decimal
- "Highlight Best" toggle button with data-testid="highlight-best-btn":
  - When active, the tool row with the highest average score gets data-testid="best-tool" added (or a visible highlight class)
- Add Tool form:
  - Text input, label "Tool Name", data-testid="input-tool-name"
  - Text input, label "Category", data-testid="input-category"
  - Text input, label "Website", data-testid="input-website"
  - For each criterion, a number input labeled with the criterion name, data-testid="input-score-{index}"
  - Submit button: "Add Tool"
- Each tool row has a "Remove" button with data-testid="remove-tool-btn"
- Add Criterion form:
  - Text input, label "Criterion Name", data-testid="input-criterion"
  - Submit button: "Add Criterion"

## Behaviors

- Average score is mean of all criterion scores for that tool, shown to 1 decimal
- "Highlight Best" toggles on/off; when on, the row with the highest average has data-testid="best-tool"
- Adding a tool appends a row; removing deletes it
- Adding a criterion adds a new column; all existing tools get score 0 for the new criterion
- If only one tool, it is the "best" when highlight is on

## Edge Cases

- Tool name must be non-empty to submit
- Criterion name must be non-empty to add
- Scores must be integers 1-10 (default to 5 if not provided)
- When all tools are removed, the table still shows header row with criteria
