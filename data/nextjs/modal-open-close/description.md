# Modal open / close

Implement a client component `ModalDemo` in `components/ModalDemo.tsx`:

- Renders a `<button data-testid="open">` with the text `"Open"`.
- When clicked, it shows a modal: an element `data-testid="modal"` containing the text
  `"This is a modal"` and a `<button data-testid="close">` with the text `"Close"`.
- The modal is **absent from the DOM** when closed.
- Clicking the close button hides the modal and returns to the initial state.
- The Open button must remain visible at all times.

Default export.
