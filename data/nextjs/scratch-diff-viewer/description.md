# Diff Viewer

A side-by-side text diff viewer that highlights line-level differences between two text inputs.

## Layout
- Page title: "Diff Viewer"
- Two labeled `<textarea>` inputs side by side:
  - Left: aria-label "Original Text", placeholder "Enter original text..."
  - Right: aria-label "Modified Text", placeholder "Enter modified text..."
- A "Compare" button that triggers the diff computation
- A results section below showing the diff output

## Seed Data
Pre-fill both textareas on mount:
- Original:
  ```
  Hello World
  This is line two
  This line will be removed
  Same line here
  ```
- Modified:
  ```
  Hello World
  This is line two
  Same line here
  This line was added
  ```

## Diff Algorithm
Split each text by newline (`\n`). Compute a line-by-line diff using the LCS (longest common subsequence) approach or a simple sequential diff:
- Lines present in both (unchanged): type `"same"`
- Lines only in original: type `"removed"`
- Lines only in modified: type `"added"`

Display the diff as a list of rows. Each row has:
- A status indicator: `"+"` for added, `"-"` for removed, `" "` (space) for same
- The line text
- Background color styling: green tint for added, red tint for removed, white/transparent for same

## Diff Display
- Each diff row: `data-testid="diff-row"`
- Added rows also have `data-testid="diff-added"`
- Removed rows also have `data-testid="diff-removed"`
- Same rows also have `data-testid="diff-same"`
- A summary line: `data-testid="diff-summary"` showing e.g. `"2 added, 1 removed, 3 unchanged"`

## Interactions
- On initial render, automatically compute and display the diff of the seed data.
- When the user clicks "Compare", recompute the diff from the current textarea values.
- If both textareas are empty, show `data-testid="diff-empty"` with text "No input to compare."
- Editing the textareas does NOT auto-recompute; user must click Compare.

## Edge Cases
- Completely identical texts: all rows are "same", summary shows "0 added, 0 removed, N unchanged"
- One textarea empty, other has content: all lines are added or all removed
- Text with blank lines: blank lines count as lines and must appear in diff
