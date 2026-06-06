# ModalDialog

A modal dialog component with an open trigger button, overlay backdrop, and close button.

## Behavior
- Renders an "Open Modal" button
- Clicking the button opens the modal (shows overlay + dialog box)
- The modal contains a title, body text, and a "Close" button
- Clicking the "Close" button dismisses the modal
- Clicking the backdrop overlay also dismisses the modal
- When closed, neither the overlay nor dialog content is rendered

## Props
```ts
interface ModalDialogProps {
  title: string
  body: string
}
```

## Data-testids
- `open-modal` — the trigger button
- `modal-overlay` — the backdrop div (covers full screen)
- `modal-dialog` — the dialog box container
- `modal-title` — the title heading inside dialog
- `modal-body` — the body text inside dialog
- `close-modal` — the close button inside dialog
