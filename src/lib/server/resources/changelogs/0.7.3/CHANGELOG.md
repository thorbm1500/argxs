# v0.7.3
#### 2026-xx-xx

## New Features
### Tags
*Empty*

## Minor Changes
- **Configuration**
  - Inlined the SvelteKit configuration inside the Vite configuration file
  - Changed property in flag configurations from 'country' to 'name'
- **Icons**
  - Changed name of filter "Date Added" to "Version" to better reflect its actual sorting method
- **Highlighted Icon Modal**
  - Adjusted text-sizing on Brand & Icon names
  - Changed modal box size
  - Page elements are now unclickable when the modal is open, and the background light is turned off, allowing the user to close the modal by clicking on any of the dark space behind it. This could previously accidentally switch to highlight other icons, if you were to click on top of an icon in the background. This change is made in an attempt to make navigating argxs feel more natural.
### x New [Brand Icons](https://argxs.com/icons/brands)
- **[New]** Twitch
- **[New]** BLAST.tv
- **[New]** Electronic Arts
  - Incl. Electronic Arts Gothenburg
- **[New]** Battlefield Franchise
  - Incl. Battlefield 6
  - Incl. Battlefield 2042
  - Incl. Battlefield 1
  - Incl. Battlefield 4
- **[New]** Ubisoft
  - Incl. Ubisoft Store
  - Incl. Ubisoft+
  - Incl. Ubisoft Creators Program
- **[New]** Anthropic
- **[New]** The Coca-Cola Company
  - Incl. Coca-Cola
  - Incl. Coca-Cola Store

## Bug Fixes
- **Highlighted Icon Modal**
  - Adjusted placement of external link in Highlighted Icon modal due to text overlapping
  - Changed text-overflow to ellipsis to fix text overflow
- **Sidebar**
  - Fixed color mismatch on dot in visitor count
- **Footer**
  - Center aligned sponsor logo

## Dependencies
- @sveltejs/kit: *2.69.2 ➜ 2.69.3*
- @humanspeak/svelte-markdown: *1.7.10 ➜ 1.8.2*
- typescript-eslint: *8.63.0 ➜ 8.64.0*