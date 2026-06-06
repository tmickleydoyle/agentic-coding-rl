# Hike Tracker

A single-page app for planning and tracking hikes. Users manage a list of upcoming and completed hikes, mark them done, and see progress stats.

## Seed Data

Six hikes pre-loaded:

| Name | Location | Distance (mi) | Elevation Gain (ft) | Status | Date |
|------|----------|--------------|---------------------|--------|------|
| Half Dome | Yosemite, CA | 16.4 | 4800 | completed | 2024-06-10 |
| Angels Landing | Zion, CA | 5.4 | 1488 | completed | 2024-07-04 |
| Enchantments | WA | 18.0 | 2200 | planned | 2024-09-01 |
| Havasupai Falls | AZ | 20.0 | 2400 | planned | 2024-10-15 |
| Rim-to-Rim | Grand Canyon, AZ | 21.0 | 5760 | planned | 2025-05-01 |
| Cascade Pass | WA | 7.4 | 1800 | completed | 2024-08-20 |

## Fields

- Name (string)
- Location (string)
- Distance in miles (number, positive)
- Elevation gain in feet (number, non-negative)
- Status ("planned" | "completed")
- Date (string, YYYY-MM-DD)

## Behaviors

1. Display all hikes in a list, each showing all fields.
2. Each planned hike has a "Mark Done" button. Clicking it changes the status to "completed".
3. Completed hikes are visually distinguished with a "Completed" label (data-testid="completed-label-{id}"). Planned hikes show "Planned" (data-testid="planned-label-{id}").
4. A stats panel shows:
   - Total hikes planned (count of planned)
   - Total hikes completed (count of completed)
   - Total miles completed (sum of distance for completed hikes)
   - Total elevation gained (ft) for completed hikes
5. Users can add a new hike via a form (all fields). Clicking "Add Hike" appends it as "planned". Name must be non-empty and distance > 0.
6. Clicking "Remove" deletes a hike.
7. Filter bar: toggle buttons or tabs for "All", "Planned", "Completed" that filter the displayed list.
8. The form is cleared after a successful add.

## Edge Cases

- Adding with empty name does nothing.
- Adding with distance 0 or less does nothing.
- When all hikes are completed, total planned = 0.
- Stats always reflect the full list (not filtered view).
