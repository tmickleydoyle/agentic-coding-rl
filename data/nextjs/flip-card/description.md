# Flip Card

A React component that displays a card which flips between a front face and a back face when clicked.

## Behavior

- Renders a card showing the **front** face initially
- Clicking the card toggles to the **back** face
- Clicking again flips back to the front
- A button labeled "Flip" triggers the flip (alternatively clicking anywhere on the card via the button)

## Content

- Front face text: "Front"
- Back face text: "Back"
- Only the currently visible face should be visible in the DOM (use conditional rendering or hidden state)

## Component

`components/FlipCard.tsx`

```tsx
export default function FlipCard(): JSX.Element
```

## Data TestIDs

- `flip-card` — the outer card container
- `front-face` — the front content element (rendered when showing front)
- `back-face` — the back content element (rendered when showing back)
- `flip-btn` — the button that triggers the flip

## Edge Cases

- Initially shows front face; back face not present in DOM
- After one flip, shows back face; front face not present in DOM
- Multiple flips alternate correctly
