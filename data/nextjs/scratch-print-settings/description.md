# Print Settings Manager

A single-page app for managing saved 3D printer setting profiles. Users can view profiles, create new ones, edit values inline, duplicate a profile, and delete profiles.

## Seed Data

Start with these 3 profiles:

| id | name           | layer_height_mm | infill_pct | supports | material | nozzle_temp_c | bed_temp_c |
|----|----------------|-----------------|------------|----------|----------|---------------|------------|
| 1  | Draft Quality  | 0.3             | 15         | false    | PLA      | 200           | 60         |
| 2  | Standard       | 0.2             | 20         | false    | PLA      | 205           | 60         |
| 3  | Fine Detail    | 0.1             | 25         | true     | PETG     | 230           | 75         |

## Fields

- **name** (string, required) — profile name
- **layer_height_mm** (number, required) — 0.05 to 0.4, step 0.05
- **infill_pct** (number, required) — 0 to 100
- **supports** (boolean) — whether supports are enabled
- **material** (string, required)
- **nozzle_temp_c** (number, required) — positive integer
- **bed_temp_c** (number, required) — non-negative integer

## UI Layout

- Heading: "Print Settings"
- Form to create a new profile: name (text), layer height (number), infill % (number), supports (checkbox), material (text), nozzle temp (number), bed temp (number), and "Save Profile" button
- List of profiles. Each profile row:
  - `data-testid="profile-name-{id}"` — profile name
  - `data-testid="profile-layer-{id}"` — layer height
  - `data-testid="profile-infill-{id}"` — infill percentage
  - `data-testid="profile-supports-{id}"` — "true" or "false"
  - `data-testid="profile-material-{id}"` — material
  - `data-testid="profile-nozzle-{id}"` — nozzle temperature
  - `data-testid="profile-bed-{id}"` — bed temperature
  - "Edit" button: `data-testid="profile-edit-{id}"` — switches the row to edit mode (inline inputs pre-filled with current values)
  - "Save" button (edit mode): `data-testid="profile-save-{id}"` — saves edits and exits edit mode
  - "Cancel" button (edit mode): `data-testid="profile-cancel-{id}"` — discards edits
  - "Duplicate" button: `data-testid="profile-duplicate-{id}"` — creates a copy with name "Copy of {name}"
  - "Delete" button: `data-testid="profile-delete-{id}"` — removes the profile
- Profile count: `data-testid="profile-count"` — "X profiles"

## Behaviors

1. **Save Profile (create)**: Creates new profile. All fields required. layer_height_mm must be > 0, infill_pct must be 0–100, nozzle_temp > 0, bed_temp >= 0. Form resets.
2. **Edit**: Clicking "Edit" opens inline editing for that row. Other rows remain non-editable.
3. **Save (edit)**: Saves all edits to the profile. Validates same rules as create.
4. **Cancel**: Reverts to original values without saving.
5. **Duplicate**: Creates a new profile with "Copy of " prepended to the name; all other fields identical. New profile appended to list.
6. **Delete**: Removes the profile. Updates count.
7. **Profile Count**: Total profiles regardless of edit state.

## Edge Cases

- Only one profile can be in edit mode at a time (clicking Edit on a second cancels the first, or simply — each profile has independent edit state with useState).
- Cancelling edit restores original values.
- Duplicating a profile that is in edit mode duplicates the saved (original) values, not the unsaved edits.
- Cannot save an edit with empty name or invalid numeric fields.
