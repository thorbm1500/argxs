# v0.7.0
#### 2026-05-23

## New Features
### Dimmable background
**The background can now be dimmed when viewing icons in the Highlighted Icon modal. The background is "lit" as default, and can be dimmed by pressing the light bulb in the top left corner of the modal.**
#### <br><span style="letter-spacing:initial;">Note: <i>This feature natively respects the user's preference for reduced transparency, and will default to a dimmed background, in case reduced transparency is prefered.</i></span>

## Minor Changes
### Accessibility
- Improved overall accessibility for users with preferences
  - `prefers-reduced-motion: reduce`
  - `prefers-reduced-transparency: reduce`
### Icons
- Icons are now only showed depending on their theme; Light themed icons are only showcased when argxs is viewed in light mode, and vice versa for dark mode.
- Improved SEO: Added page description
- Improved visibility of icon in Highlighted Icon modal, by making the modal background less see-through
- Improved overall design of Highlighted Icon modal
- An icon is now considered `NEW` for a total of 7 days, increasing it by 2, from the previous 5 days
- **[Brands](https://argxs.com/icons/brands)**
    - **New Icons**
      - **[New]** VivaBit
      - **[New]** Shopify
      - **[New]** Soundcloud
      - **[New]** Verkada
      - **[New]** Astro
      - **[New]** Stack Overflow
        - Incl. Old version
      - **[New]** Java
      - **[New]** Rust
      - **[New]** Go
      - **[New]** Gradle
      - **[New]** Alpine.js
      - **[New]** Apidog
      - **[New]** Atom
      - **[New]** Balena
        - Incl. balenaCloud
        - Incl. balenaEtcher
        - Incl. openBalena
      - **[New]** web.dev
        - Incl. Baseline
          - Incl. Newly Available
          - Incl. Limited
      - Apple
        - Apple Pay

## Fixes
- Code syntax coloring no longer fails after switching between themes, due to overlap between themes
- Fixed Geologica font not being served, causing fallback fonts to be displayed instead
### Icons
- Fixed an error preventing new images from being generated properly, requiring an additional server restart to allow serving the newly generated images
- Fixed gradient errors on all Vite icons
- Fixed gradient errors on all Rolldown icons
- Fixed gradient errors on all OKX icons
- Fixed SVG code, in Highlighted Icon modal not updating to reflect the new icon when switching themes, while the modal is open
- **[Brands](https://argxs.com/icons/brands)**
  - Zenegy
    - Fixed incorrect name on sources
### Typography
- Fixed margin between top of page and page header

## Dependencies
- @sveltejs/kit: *2.60.1 ➜ 2.61.0*