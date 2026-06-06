# Feature Flags

A single-page feature flag management dashboard.

## Seed Data

Four flags pre-loaded:
1. id:1, name:"dark-mode", enabled:true, environment:"production", description:"Enable dark mode UI"
2. id:2, name:"new-checkout", enabled:false, environment:"staging", description:"Revamped checkout flow"
3. id:3, name:"beta-search", enabled:true, environment:"staging", description:"Improved search algorithm"
4. id:4, name:"analytics-v2", enabled:false, environment:"production", description:"New analytics pipeline"

## Layout

- Heading: "Feature Flags"
- Summary counts (data-testid):
  - `count-enabled`: number of flags that are enabled
  - `count-disabled`: number of flags that are disabled

## Add Flag Form

Fields:
- Text input, aria-label "Flag Name" — identifier (kebab-case expected but not enforced)
- Text input, aria-label "Description" — short description
- Select, aria-label "Environment" — options: production, staging (default: production)

Button "Add Flag": adds flag with enabled:false. Clears fields. Does nothing if name is empty.

## Flag List

Each flag rendered with:
- `data-testid="flag-item"` on the container
- `data-testid="flag-name"` showing the name
- `data-testid="flag-status"` showing "Enabled" if enabled, "Disabled" if not
- `data-testid="flag-env"` showing the environment
- `data-testid="flag-description"` showing the description

## Toggle

Each flag has a button "Toggle" that flips the enabled boolean.

## Delete

Each flag has a "Delete" button that removes the flag.

## Filter by Environment

A select with aria-label "Filter by environment" with options: All, production, staging.
Default: "All". Shows only flags matching the selected environment (or all).

## Edge Cases

- Adding a flag with empty name does nothing.
- New flags start as disabled.
- Global counts always reflect all flags regardless of filter.
- Environment filter does not affect counts.
