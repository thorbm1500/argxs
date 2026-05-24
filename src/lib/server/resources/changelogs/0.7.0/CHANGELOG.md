# v0.7.0
#### 2026-05-25

## New Features
### Dimmable background
**The background can now be dimmed when viewing icons in the Highlighted Icon modal. The background is "lit" as default, and can be dimmed by pressing the light bulb in the top left corner of the modal.**
#### <br><span style="letter-spacing:initial;">Note: <i>This feature natively respects the user's preference for reduced transparency, and will default to a dimmed background, in case reduced transparency is prefered.</i></span>

## 184 New [Brand Icons](https://argxs.com/icons/brands)
- **[New]** VivaBit
- **[New]** Shopify
- **[New]** Soundcloud
- **[New]** Verkada
- **[New]** Astro
- **[New]** Stack Overflow
  - Incl. Old version
- **[New]** C (Language)
- **[New]** C++
- **[New]** C#
- **[New]** Ceylon
- **[New]** Clio
- **[New]** Crystal
- **[New]** Dart
- **[New]** Erlang
- **[New]** Elm
- **[New]** Eta
- **[New]** Fortran
- **[New]** F#
- **[New]** Go
- **[New]** Haskell
- **[New]** Haxe
- **[New]** Hack
- **[New]** HTML5
- **[New]** Java
- **[New]** JavaScript
- **[New]** TypeScript
- **[New]** PureScript
- **[New]** ReScript
- **[New]** CoffeeScript
- **[New]** Julia Programming Language
  - Incl. JuliaCon
- **[New]** Lua
- **[New]** Markdown
- **[New]** Mint
  - Incl. **[Animated]** Mint Icon
- **[New]** Nim
- **[New]** OCaml
- **[New]** Perl
- **[New]** PHP
  - Incl. PHP 8.5
  - Incl. Old version
- **[New]** Python
  - Incl. MicroPython
- **[New]** RAML
- **[New]** Ruby
  - Incl. Ruby on Rails
- **[New]** Rust
- **[New]** R (Language)
- **[New]** Solidity
- **[New]** V (Language)
- **[New]** Zig
  - Incl. Mascots Zero & Ziggy
- **[New]** TOML
- **[New]** YAML
- **[New]** Processing Foundation
  - Incl. Processing
  - Incl. p5.js
  - Incl. Processing Android
  - Incl. Processing Python
- **[New]** Gradle
- **[New]** Alpine.js
- **[New]** Atom
- **[New]** Vim
- **[New]** Apidog
- **[New]** Balena
  - Incl. balenaCloud
  - Incl. balenaEtcher
  - Incl. openBalena
- **[New]** web.dev
  - Incl. Baseline
    - Incl. Newly Available
    - Incl. Limited
- **[New]** BuildKite
- **[New]** W3C
- Apple
  - Apple Pay
- Meta
  - Meta Open Source

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
- An icon is now considered `NEW` for a total of 14 days, increasing it by 9, from the previous 5 days

## Fixes
- Code syntax coloring no longer fails after switching between themes, due to overlap between themes
- Fixed Geologica font not being served, causing fallback fonts to be displayed instead
- Several button design issues
### Icons
- Fixed an error preventing new images from being generated properly, requiring an additional server restart to allow serving the newly generated images
- Fixed gradient errors on all Vite icons
- Fixed gradient errors on all Rolldown icons
- Fixed gradient errors on all OKX icons
- Fixed SVG code, in Highlighted Icon modal not updating to reflect the new icon when switching themes, while the modal is open
- Fixed uncaught errors being thrown when iterating through icon variations, due to clicking the SVG element inside of the button, and not the button itself
- **[Brands](https://argxs.com/icons/brands)**
  - Zenegy
    - Fixed incorrect name on sources
### Typography
- Fixed margin between top of page and page header

## Dependencies
- @sveltejs/kit: *2.60.1 ➜ 2.61.1*