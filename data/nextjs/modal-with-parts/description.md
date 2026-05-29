# Modal composed of Header/Body/Footer subcomponents

This task spans **4 files**:

- `components/ModalHeader.tsx` — accepts `{ title: string; onClose: () => void }`. Renders `<div data-testid="modal-header"><h2 data-testid="modal-title">{title}</h2><button data-testid="modal-close">Close</button></div>`. The close button calls `onClose` when clicked.
- `components/ModalBody.tsx` — accepts `{ children: React.ReactNode }`. Renders `<div data-testid="modal-body">{children}</div>`.
- `components/ModalFooter.tsx` — accepts `{ onConfirm: () => void; onCancel: () => void }`. Renders `<div data-testid="modal-footer">` containing two buttons: `<button data-testid="modal-confirm">OK</button>` and `<button data-testid="modal-cancel">Cancel</button>`. Each calls its prop handler.
- `components/Modal.tsx` (entry, default export) — accepts `{ open: boolean; title: string; children: React.ReactNode; onClose: () => void; onConfirm: () => void }`. When `open` is `false`, render `null`. When `open` is `true`, render `<div data-testid="modal" role="dialog">` containing `ModalHeader` (passing `title` and `onClose`), `ModalBody` (passing `children`), and `ModalFooter` (passing `onConfirm` and `onClose` for cancel).
