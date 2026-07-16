# Version 0.7.2
#### 2026-07-12

## New Features
### Icon Version Tags & New Sorting
Icons now contain a version tag, showing what version an icon was added. This changes which icons are marked as "New",
where all icons that have been added in the current live version, will be marked as new.<br>
This change has also made it possible to move more compute server-side, freeing the user of redundant and repetitive
compute. All icons are checked if they're new when the server initializes, and this data is simply passed along with the
rest of the icon's data, when the user loads the page.

## Minor Changes
- **Sidebar**
  - Fixed visitor count dot positioned outside its box
- **Icons**
  - Updated "Good to know" text
  - Replaced all Proton icons with new icons sourced directly from Proton
  - Searches are now performed automatically after a small delay. If a user starts typing, then pauses for half a second without typing, the search will be submitted automatically.
  - Searches are now performed automatically, if the user has entered text in the search bar and exits the search bar without executing the search. This allows for faster and more efficient browsing from power users.
  - Filters can now be turned off by iterating through their different filter modes, no longer requiring the user to press the "Clear Filters" button.
  - Fixed bug causing variable state errors in some cases when switching between page themes 
## 109 New [Brand Icons](https://argxs.com/icons/brands)
- **[New]** Pitch
- **[New]** Rockstar Games
  - Incl. Grand Theft Auto VI
  - Incl. Grand Theft Auto V
  - Incl. Grand Theft Auto Online
  - Incl. Red Dead Redemption 2
  - Incl. Red Dead Online
- **[New]** Epic Games
  - Incl. Unreal Engine
- **[New]** Valve
  - Incl. Steam
- **[New]** Ønskeskyen
- **[New]** SeeSafe
- **[New]** EK (Business Academy Copenhagen)
- Apple
  - Incl. App Store Badge
- Google
  - Incl. Google Play Store Badge
- Vivaldi
  - Incl. Vivaldi Community
- Lego
  - Incl. Yellow Lego Minifigure Head
- Proton
  - Incl. Proton Logo Variations
  - Incl. Proton Meet
  - Incl. Proton Wallet
  - Incl. Proton Authenticator
  - Incl. Proton Sheets
  - Incl. Proton Docs
  - Incl. Proton Lumo & Proton Lumo Mascot
  - Incl. Full Logo Versions of Existing Icons

## Dependencies
- svelte: *5.55.10 ➜ 5.56.4*
- @sveltejs/kit: *2.61.1 ➜ 2.69.2*
- @humanspeak/svelte-markdown: *1.6.0 ➜ 1.7.10*
- vite: *8.0.16 ➜ 8.1.4*
- @types/node: *25.9.4 ➜ 25.9.5*
- globals: *17.6.0 ➜ 17.7.0*
- typescript-eslint: *8.60.0 ➜ 8.63.0*
- tailwindcss: *4.3.1 ➜ 4.3.2*
- @tailwindcss/typography: *0.5.19 ➜ 0.5.20*
- @tailwindcss/vite: *4.3.1 ➜ 4.3.2*