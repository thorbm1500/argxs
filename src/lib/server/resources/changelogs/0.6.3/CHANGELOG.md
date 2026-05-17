# v0.6.3
#### 2026-05-17

## Minor Changes
- Added **Back to Top** button to all pages. The button will automatically appear and stay visible, as long as the user has scrolled further than 750px
### Changelog
- Updated design of all existing changelogs

## Accessibility
### Sidebar
- Improved navigation on keyboard
- Sidebar is now indexed second last, and can be just as easily accessed with SHIFT+TAB going backwards. The sidebar was previously indexed second, making it unnaturally block the user's navigation of a newly loaded page
### Header
- The Theme-switch button is now index last, and can be just as easily accessed with SHIFT+TAB going backwards. The button was previously indexed first, making it unnaturally block the user's navigation of a newly loaded page
### Icons
- Each icon container is now reactive when tab-focused, as if it was hovered with a mouse
- It is now possible to browse icon variations on icon containers, only using the keyboard

## Fixes
### Changelog
- Fixed numerous typos both in text and in links
### Icons
- Icon Modal is no longer stuck on the first icon

## Dependencies
- **[Removed]** svelte-highlight