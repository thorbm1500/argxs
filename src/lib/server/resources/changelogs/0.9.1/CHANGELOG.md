# Version 0.9.1
#### 2026-xx-xx

## Minor Changes
- Added type attribute to favicon entry in site head
- Icons now show as "NEW" if added within the same minor version
- RGB lightbar in the header is now visible at all times, instead of fading in and out
- General design updates across the entire site, for a more consistent user-experience
- **Colors**
  - **Generator**
    - Color values can now be copied by clicking on them

### New Flag Resources
- **x New Flags**
  - **[New]** **Empty**

### New Brand Resources
- **x New Icons**
  - **[New]** **itslearning**

## Bug Fixes
- Sidebar no longer overflows on odd screen sizes
- **Icons**
  - Removed config entry for "ve-state.svg", due to asset being removed in previous version
  - Correct asset name in config entry for Google from "google-variant-icon.svg" to "google-icon.svg"

## Dependencies
- @jridgewell/sourcemap-codec: *1.5.5 ➜ 1.6.0*
- @humanspeak/svelte-markdown: *1.8.8 ➜ 1.9.0*
- @humanspeak/memory-cache: *1.1.2 ➜ 1.2.0*
- svelte: *5.56.10 ➜ 5.57.0*
- devalue: *5.9.1 ➜ 5.9.2*
- ignore: *7.0.6 ➜ 7.0.8*