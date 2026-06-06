# Release Notes Manager

A single-page app for managing product release notes.

## Seed Data

Three release notes pre-loaded:
1. id:1, version:"2.5.0", product:"Web App", category:"feature", title:"Drag and drop file upload", body:"Users can now upload files by dragging them directly into the browser.", published:true
2. id:2, version:"2.5.0", product:"Mobile App", category:"bugfix", title:"Fixed crash on startup", body:"Resolved a crash that occurred when opening the app on iOS 17.", published:true
3. id:3, version:"2.6.0", product:"Web App", category:"improvement", title:"Faster page loads", body:"Optimized asset loading to reduce initial page load time by 40%.", published:false

## Layout

- Heading: "Release Notes"
- Summary stats (data-testid):
  - `count-published`: number of published release notes
  - `count-draft`: number of unpublished (draft) release notes

## Add Release Note Form

Fields:
- Text input, aria-label "Version" — e.g. 2.7.0
- Text input, aria-label "Product" — product name
- Select, aria-label "Category" — options: feature, bugfix, improvement (default: feature)
- Text input, aria-label "Title" — short title
- Textarea, aria-label "Body" — longer description

Button "Add Note": adds note with published:false. Clears fields. Does nothing if title is empty.

## Release Note List

Each note rendered with:
- `data-testid="note-item"` on the container
- `data-testid="note-version"` showing the version
- `data-testid="note-product"` showing the product
- `data-testid="note-category"` showing the category
- `data-testid="note-title"` showing the title
- `data-testid="note-body"` showing the body
- `data-testid="note-status"` showing "Published" if published, "Draft" if not

## Publish / Unpublish

Each note has a button:
- If draft: button text "Publish" — clicking sets published:true
- If published: button text "Unpublish" — clicking sets published:false

## Filter by Category

A select with aria-label "Filter by category" — options: All, feature, bugfix, improvement.
Default: "All". Shows only notes matching selected category.

## Filter by Product

A select with aria-label "Filter by product" — options: All, Web App, Mobile App (plus dynamically added products).
Default: "All". Shows only notes matching selected product.

Both filters are applied simultaneously (AND logic).

## Delete

Each note has a "Delete" button.

## Edge Cases

- Adding with empty title does nothing.
- New notes start as Draft.
- Global counts always reflect all notes regardless of filters.
