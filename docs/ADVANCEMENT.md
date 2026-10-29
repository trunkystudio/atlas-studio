# Atlas Studio advancement checklist

All items below remain in scope. Completion requires implementation, meaningful verification, documentation, and a reviewed installer. Existing features are not automatically considered complete upgrades.

- [ ] Editor polish: paste modes, images/captions/alt text, table behavior, selection and undo continuity
- [ ] Workspace navigation history, recent locations, keyboard/mouse navigation and position recovery
- [ ] Document outline: jump, heading checks, collapse and section reordering
- [ ] Two-pane writing/reference improvements and synchronized scrolling
- [ ] Saved workspace layouts
- [ ] Reusable paragraph styles and export mapping
- [ ] Publication preview and export preflight
- [ ] Named checkpoints and project revision comparisons
- [ ] Comment threads, filters, orphan handling and review packages
- [ ] Link previews, deep links, orphan discovery and connection provenance
- [ ] Research deduplication, quotation provenance and attachment relinking
- [ ] Saved searches, contextual results and advanced matching
- [ ] Offline dictation input test, transcription review and model choices
- [ ] Backup scheduling, freshness, restoration comparison and recovery startup
- [ ] Large-library performance measurements and improvements
- [ ] Keyboard, screen reader, RTL, scaling and language coverage
- [ ] Interface consistency and optional-view controls
- [ ] Version/release notes and verified optional updates; signing requires an actual signing identity

Current work: navigation history, document outline foundation, and understandable backup health. Do not mark whole categories done until every listed requirement is verified. Do not publish an installer as the completed roadmap while any category remains open.

## Development progress — first stage

Implemented in the development branch: optional live document outline with heading jumps and level-gap indicators; session Back/Forward history with Alt Left/Right and deleted-document skipping; backup freshness and availability guidance. Outline visibility is remembered. History resets when accepting a library to avoid crossing library boundaries. This is not the complete roadmap or an updated installer.

Verification: 63 unit checks passed, production build succeeded, and isolated Electron checks passed for live outline updates, heading warnings, cursor placement and Back/Forward document navigation. Outstanding: outline collapse/reorder, recent locations and mouse history buttons, scheduled backups and the rest of the roadmap.

## Development progress — outline and navigation controls

- Added outline descendant collapsing (outline only; draft text remains visible).
- Added sibling section movement carrying rich content and subsections, with isolated Undo history. Nested headings inside tables/lists stay navigable but cannot be moved here.
- Added current-heading indication and contextual move controls accessible by keyboard.
- Added the last 20 distinct session locations and mouse Back/Forward support. Re-selecting the current location does not discard the next navigation entry.
- Added Escape and focus-out dismissal for recent locations.
- Updated existing offline lessons and both generated user guides.
- Validation: 64 unit tests; production build; isolated Electron checks for live heading updates, collapse/expand, section movement/Undo, recent locations, and mouse navigation; existing full desktop regression suite passed.
- Installer/release 0.1 remains unchanged. Remaining roadmap items are still open, including editor text folding, export preflight, saved layouts, deeper review/research, backup scheduling, performance, accessibility and updates.
