# AccordionItem

A single accordion item with a toggle header and collapsible content panel.

## Behavior
- Renders a header button and a content panel
- Initially the content panel is hidden (collapsed)
- Clicking the header toggles open/closed state
- When open, the content text is visible
- The header button shows "+" when closed and "-" when open
- Accepts `title` and `content` props

## Props
```ts
interface AccordionItemProps {
  title: string
  content: string
}
```

## Data-testids
- `accordion-toggle` — the header button
- `accordion-content` — the content panel (always in DOM; hidden via CSS or conditional render when closed)

## Notes
- Use `display: none` style or conditional rendering to hide content when closed
- The toggle icon text should be accessible in the button
