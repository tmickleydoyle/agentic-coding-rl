# Sort Visualizer

Build a sorting algorithm visualizer that shows step-by-step how bubble sort works on an array of numbers.

## Algorithm: Bubble Sort
Bubble sort works by repeatedly stepping through the list, comparing adjacent elements, and swapping them if they are in the wrong order.

## Seed Data
Default array: [64, 34, 25, 12, 22, 11, 90]. Render this on load.

## UI Layout

### Array Input
- A labeled text input (label: "Array") where users enter comma-separated integers. Default: "64, 34, 25, 12, 22, 11, 90".
- A "Set Array" button. On click: parse the input and update the working array. Invalid entries (non-numbers, empty) are ignored/skipped.

### Sorting Controls
- A "Step" button: advances the bubble sort by one comparison/swap step. Shows the array state after the step.
- A "Sort All" button: runs all remaining steps at once, showing the fully sorted array.
- A "Reset" button: resets the array back to the last "Set Array" state (the initial parse), clears step count.

### Array Display
- Show the current array values as individual cells, each with data-testid="array-cell".
- Highlight (via a CSS class or aria attribute) the two elements being compared in the current step. These cells have data-testid="comparing-cell".
- Show the step count in data-testid="step-count".
- Show whether sorting is complete (the array is fully sorted) in data-testid="sort-status": "Sorted" when done, "In progress" when not.

### Stats
- Show total number of swaps performed so far in data-testid="swap-count".
- Show total number of comparisons performed so far in data-testid="comparison-count".

## Behavior Details
- On initial render, show the seed array unsorted, step-count=0, swap-count=0, comparison-count=0, sort-status="In progress".
- The Step button is disabled when sorting is complete.
- The Sort All button is disabled when sorting is complete.
- Each Step press increments comparison-count by 1. If a swap occurs, also increment swap-count.
- After "Set Array", reset step-count, swap-count, comparison-count to 0.
- Reset restores the array to the state after the last Set Array (or seed if never set).

## Edge Cases
- If the input has only 1 valid number, the array is trivially sorted.
- Duplicate values are allowed and handled correctly.
- Array of already-sorted values should still allow stepping (0 swaps, but comparisons still occur).
