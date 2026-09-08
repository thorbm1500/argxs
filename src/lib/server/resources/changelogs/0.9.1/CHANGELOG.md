# Version 0.9.1
#### 2026-09-08

## Minor Changes
- Added type attribute to favicon entry in site head
- Icons now show as "NEW" if added within the same minor version (This is a temporary feature that will be removed after 1.0 launches)
- RGB lightbar in the header is now visible at all times, instead of fading in and out
- General design updates across the entire site, for a more consistent user-experience
- **Colors**
  - **Generator**
    - Color values can now be copied by clicking on them

### New Brand Resources
- **9 New Icons**
  - **[New]** **itslearning**
  - **[New]** **Splice**
  - **[New]** **BisectHosting**

## Bug Fixes
- Sidebar no longer overflows on odd screen sizes
- **Icons**
  - Removed config entry for "ve-state.svg", due to asset being removed in previous version
  - Correct asset name in config entry for Google from "google-variant-icon.svg" to "google-icon.svg"

## Dependencies
- bun: *1.4.0 ➜ 1.4.2*
- @types/bun: *1.4.0 ➜ 1.4.2*
- globals: *17.11.0 ➜ 17.12.0*
- typescript-eslint: *8.68.0 ➜ 8.70.0*
- @humanspeak/svelte-markdown: *1.8.8 ➜ 1.9.0*
- @humanspeak/memory-cache: *1.1.2 ➜ 1.2.0*
- svelte: *5.56.10 ➜ 5.57.0*
- @sveltejs/acorn-typescript: *1.0.10 ➜ 1.0.13*