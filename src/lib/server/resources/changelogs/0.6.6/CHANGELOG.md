# v0.6.6
#### 2026-05-23

## Minor Changes
### Icons
- Improved SEO: Added page description
- Improved visibility of icon in Highlighted Icon modal, by making the modal background less see-through
- **[Brands](https://argxs.com/icons/brands)**
    - **New Icons**
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
      - **[New]** VivaBit

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