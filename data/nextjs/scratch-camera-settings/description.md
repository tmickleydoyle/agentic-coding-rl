# Camera Settings Manager

A single-page app to save and compare camera exposure configurations.

## Seed Data

Start with these three presets:

| id | name              | aperture | shutter  | iso  | mode    |
|----|-------------------|----------|----------|------|---------|
| 1  | Portrait Sunny    | f/1.8    | 1/500s   | 100  | Aperture Priority |
| 2  | Night Street      | f/2.8    | 1/60s    | 3200 | Manual  |
| 3  | Landscape Golden  | f/11     | 1/125s   | 200  | Program |

## Fields

- **Name** (text input, required)
- **Aperture** (text input, required, e.g. "f/2.8")
- **Shutter Speed** (text input, required, e.g. "1/250s")
- **ISO** (number input, required, positive integer)
- **Mode** (select: "Manual" | "Aperture Priority" | "Shutter Priority" | "Program")

## Behaviors

1. The page renders a heading "Camera Settings".
2. All seed presets are shown in a list on load.
3. Each preset shows name, aperture, shutter speed, ISO, and mode.
4. A form lets the user add a new preset.
5. Submitting a valid form appends the preset and clears the form.
6. Required fields must be non-empty; ISO must be a positive number.
7. Each preset has a Delete button to remove it.
8. A counter shows "X presets" where X is the current count.
9. Clicking a preset row highlights it (adds CSS class "selected" or toggles an aria-selected attribute) and shows its details in a detail panel below the list.
10. Clicking the same preset again deselects it and hides the detail panel.

## Edge Cases

- If no preset is selected, the detail panel is not shown.
- Deleting the currently selected preset hides the detail panel.
- ISO of 0 or negative should not submit.
