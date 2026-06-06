# TabSwitcher

A tab switcher component that renders a row of tab buttons and displays the active tab's content panel.

## Behavior
- Accepts an array of tab objects with `id`, `label`, and `content` fields
- Renders one button per tab in a tab bar
- The first tab is active by default
- Clicking a tab button makes it the active tab and shows its content
- The active tab button has `aria-selected="true"`; others have `aria-selected="false"`
- Only the active tab's content panel is rendered

## Props
```ts
interface Tab {
  id: string
  label: string
  content: string
}

interface TabSwitcherProps {
  tabs: Tab[]
}
```

## Data-testids
- `tab-{id}` — each tab button (e.g. `tab-home`)
- `tab-panel` — the currently visible content panel
