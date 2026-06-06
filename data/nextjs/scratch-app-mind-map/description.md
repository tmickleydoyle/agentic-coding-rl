# scratch-app-mind-map

Build a multi-route mind map application with hierarchical node management.

## Routes
- **View** (`/view`): Display all nodes as a nested tree (root nodes at top, children indented beneath parents). Show node label in its assigned color.
- **Manage** (`/manage`): Add new nodes with label (required), optional parent node (dropdown), and color. Delete nodes (deleting a node also removes all its descendants).
- **Filter** (`/filter`): Filter nodes by color — buttons for each color, display matching nodes.

## API
- `GET /api/items` — list all nodes; `?color=<color>` — filter by color
- `POST /api/items` — create `{ label, parentId, color }`
- `DELETE /api/items?id=<id>` — delete node and all descendants

## Requirements
- In-memory store with `__reset()` for tests
- Label required (400 if missing)
- Available colors: blue, red, green, yellow, purple
