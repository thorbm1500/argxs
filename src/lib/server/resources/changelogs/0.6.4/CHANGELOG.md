# v0.6.4
#### 2026-05-18

## Minor Changes
- Page Footer is now hidden, until the page is fully loaded, to avoid awkward placements
### Header
- Updated design to better match the rest of argxs
- Code cleanup
### Sidebar
- Code cleanup
### Icons
- Code cleanup

## Fixes
- Page Footer no longer carries over state from previous page
- Page now scrolls to the top on navigation
- Fixed sidebar button showing on homepage, despite the sidebar being visible
### Icons
- Icon name no longer overlaps with external link, in cases of letters going below the text-line, such as "**g**", "**y**", "**p**", etc.

## Dependencies
- svelte: *5.55.7 ➜ 5.55.9*
- typescript-eslint: *8.59.3 ➜ 8.59.4*
- @types/node: *25.8.0 ➜ 25.9.1*
- @humanspeak/svelte-markdown: *1.5.0 ➜ 1.5.2*