# Version 0.7.3
#### 2026-07-16

## New Features
### Tags
Tags are now available when browsing flag & brand icons. Some tags have already been added, with more coming in the future.

## Minor Changes
- Changelog titles changed from "vX.X.X" to "Version X.X.X"
- **Configuration**
  - Inlined the SvelteKit configuration inside the Vite configuration file
  - Changed property in flag configurations from 'country' to 'name'
- **Icons**
  - Changed name of filter "Date Added" to "Version" to better reflect its actual sorting method
  - Generated images no longer target a minimum of 1000px on both width/height, but now instead target a total pixel count of 1.000.000. This change is made to account for oddly sized images, that would otherwise scale to a ridiculous size.
  - Stale images are now checked for and removed, to ensure to images are leftover and forgotten from changes made to its parent configuration.
  - Renamed all assets for "Ønskeskyen" to "onskeskyen"
- **Highlighted Icon Modal**
  - Adjusted text-sizing on Brand & Icon names
  - Changed modal box size
  - Page elements are now unclickable when the modal is open, and the background light is turned off, allowing the user to close the modal by clicking on any of the dark space behind it. This could previously accidentally switch to highlight other icons, if you were to click on top of an icon in the background. This change is made in an attempt to make navigating argxs feel more natural.
### 81 New [Brand Icons](https://argxs.com/icons/brands)
- **[New]** Zealand - Academy of Technologies and Business
- **[New]** CBS - Copenhagen Business School
- **[New]** MIT - Massachusetts Institute of Technology
- **[New]** Harvard University
- **[New]** CORSAIR
- **[New]** NZXT
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
- **[New]** IKEA
- **[New]** Kia

## Bug Fixes
- **Highlighted Icon Modal**
  - Adjusted placement of external link in Highlighted Icon modal due to text overlapping
  - Changed text-overflow to ellipsis to fix text overflow
- **Sidebar**
  - Fixed color mismatch on dot in visitor count
- **Footer**
  - Center aligned sponsor logo

## Dependencies
- svelte: *5.56.4 ➜ 5.56.5*
- @sveltejs/kit: *2.69.2 ➜ 2.69.3*
- @humanspeak/svelte-markdown: *1.7.10 ➜ 1.8.4*
- typescript-eslint: *8.63.0 ➜ 8.64.0*