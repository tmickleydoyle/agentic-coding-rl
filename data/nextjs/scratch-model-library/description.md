# 3D Model Library

A single-page app for browsing and managing a collection of 3D printable models. Users can search models, tag them, mark favorites, and add or remove models from the library.

## Seed Data

Start with these 5 models:

| id | name               | category    | source    | tags                    | favorited | file_size_mb |
|----|--------------------|-------------|-----------|-------------------------|-----------|--------------|
| 1  | Benchy Boat        | calibration | Thingiverse | benchy, test, boat    | true      | 1.2          |
| 2  | Voronoi Vase       | decorative  | Printables  | vase, voronoi, home   | false     | 3.8          |
| 3  | Hex Box Lid        | storage     | Thingiverse | storage, hex, lid     | false     | 0.9          |
| 4  | Dragon Full Body   | figurine    | MyMiniFactory | dragon, fantasy     | true      | 15.4         |
| 5  | Cable Clip Pack    | utility     | Printables  | cable, clip, utility  | false     | 0.4          |

## Fields

- **name** (string, required)
- **category** (string, required) — e.g. calibration, decorative, storage, figurine, utility
- **source** (string, required) — platform name
- **tags** (string) — comma-separated tag list (stored as string, displayed as-is)
- **favorited** (boolean) — whether the model is favorited
- **file_size_mb** (number, required) — positive number

## UI Layout

- Heading: "Model Library"
- Search input: `data-testid="search-input"` — filters model list by name (case-insensitive, partial match)
- "Favorites only" toggle button: `data-testid="favorites-toggle"` — when active, shows only favorited models
- Form to add a model: name (text), category (text), source (text), tags (text), file size (number), and "Add Model" button
- List of models. Each model row:
  - `data-testid="model-name-{id}"` — model name
  - `data-testid="model-category-{id}"` — category
  - `data-testid="model-source-{id}"` — source platform
  - `data-testid="model-tags-{id}"` — tags string
  - `data-testid="model-size-{id}"` — file size in MB (the number as stored)
  - `data-testid="model-favorited-{id}"` — "true" or "false"
  - "Favorite" button (when not favorited): `data-testid="model-favorite-btn-{id}"` — toggles favorited to true
  - "Unfavorite" button (when favorited): `data-testid="model-unfavorite-btn-{id}"` — toggles favorited to false
  - "Remove" button: `data-testid="model-remove-{id}"` — removes the model
- Stats: `data-testid="library-count"` — "X models" (total in library, unaffected by search/filter)
- `data-testid="favorites-count"` — "Y favorites" (total favorited, unaffected by search/filter)

## Behaviors

1. **Search**: Filters visible list by name substring (case-insensitive). Does not affect stats counters.
2. **Favorites Toggle**: When active, shows only favorited models. Can combine with search.
3. **Favorite / Unfavorite**: Toggles the favorited field. Updates favorites-count immediately.
4. **Remove**: Removes the model from the library. Updates both counters.
5. **Add Model**: Appends model with favorited=false. All fields except tags required. file_size_mb must be > 0. Form resets.
6. **Stats**: library-count and favorites-count always reflect entire library (not filtered view).

## Edge Cases

- Search + favorites filter can be combined: show models matching both conditions.
- Empty search shows all (or all favorites if toggle active).
- Removing a favorited model decrements favorites-count.
- Adding a model with empty name, category, source, or file_size_mb <= 0 does nothing.
