# Version 0.8.0
#### 2026-08-15

## New Domain & Migration to [Cloudflare](https://cloudflare.com)
**argxs** is now served under **argxs.dev** and argxs.com now redirects to [argxs.dev](https://argxs.dev).<br>
With this change argxs has also been migrated to Cloudflare for better safety for the users and for a better performance delivering the site
## New Logo & Icon
A logo & icon has been made for **argxs**, replacing the old personal favicon and the header logo

## Minor Changes
- Addition of [ThisIsHumanMade](https://thisishumanmade.org) badge
- Addition of screen size warning on smaller screens. *More information on this will be added on the upcoming page [Core Concept](https://argxs.dev/concept)*
- The codebase now makes use of linting and formatting, provided by [**Vite+**](https://viteplus.dev), to make the codebase stronger and cleaner to work with
- General updates to the design, for a more consistent design
### Changelogs
- Updated page title from "Changelog" to "Changelogs"
### Sidebar
- Updated design, making the design cleaner and easier to navigate
- Updated layout for a cleaner and less congested look
### Icons
- Added clearing of user search when navigation between Brand & Flag icons
- Improved accessibility to users with prefers-reduced-motion enabled
- Updated general design to be more consistent
- **[New Tag]** Real Estate
- **[New Tag]** Software
- **Highlighted Icon Modal**
  - Added scrolling to icon name when hovering, allowing abnormally long names to still be readable regardless of screen size

### New Flag Resources
- **68 New Flags**
  - **United States of America State Flags**
    - **[New]** Louisiana 
    - **[New]** Maine
      - Incl. Maine Bicentennial Flag (2020)
    - **[New]** Maryland
    - **[New]** Massachusetts
    - **[New]** Michigan
    - **[New]** Minnesota
    - **[New]** Mississippi
      - Incl. Mississippi Bicentennial Flag (2017)
    - **[New]** Missouri
    - **[New]** Montana
    - **[New]** Nebraska
    - **[New]** Nevada
    - **[New]** New Hampshire
    - **[New]** New Jersey
      - Incl. New Jersey Tricentennial Flag (1964)
    - **[New]** New Mexico
    - **[New]** New York
    - **[New]** North Carolina
    - **[New]** North Dakota
    - **[New]** Ohio
    - **[New]** Oklahoma
    - **[New]** Oregon
      - Front (observe) & Back (reserve)
    - **[New]** Pennsylvania
    - **[New]** Rhode Island
    - **[New]** South Carolina
    - **[New]** South Dakota
    - **[New]** Tennessee
    - **[New]** Texas
    - **[New]** Utah
      - Incl. Utah Quasquicentennial Flag (2021)
    - **[New]** Vermont
    - **[New]** Virginia
    - **[New]** Washington
    - **[New]** West Virginia
    - **[New]** Wisconsin
    - **[New]** Wyoming
    - Alabama
      - Incl. Alabama Sesquicentennial Flag (1969)
      - Incl. Alabama Bicentennial Flag (2019)
    - Illinois
      - Incl. Illinois Centennial Flag (1918)
      - Incl. Illinois Sesquicentennial Flag (1968)

### New Brand Resources
- **107 New Icons**
  - **[New]** argxs
  - **[New]** Codeberg
  - **[New]** SBAB
    - Incl. Booli & Hittamäklare
  - **[New]** Hallon
  - **[New]** Tele2
  - **[New]** Telia
  - **[New]** Telmore
  - **[New]** City Gross
  - **[New]** ICA
    - Incl. ICA Banken
    - Incl. ICA Försäkring
    - Incl. Apotek Hjärtat
  - **[New]** Sony
    - Incl. PlayStation
    - Incl. PlayStation Store
  - **[New]** Crowdin
  - **[New]** BULKHEAD
    - Incl. WARDOGS
  - **[New]** FreeCAD
  - Threads
    - Updated logo & icon to the new Threads rebrand - Old logo & icons renamed to "Old Threads"
  - Twitch
    - Replaced all existing logos & icons with SVGs sourced directly from [Twitch](https://twitch.tv)
  - Google
    - Incl. White Monochrome Google Logo
  - Docker
    - Replaced existing logo & icon with SVGs sourced directly from [Docker](https://docker.com)
    - Added all new icons and logos
    - Incl. Docker Docs
  - NVIDIA
    - Replaced all existing logos & icons with SVGs sourced directly from [NVIDIA](https://www.nvidia.com)
  - Bun
    - Replaced existing icon with SVG sourced directly from [Bun](https://bun.com)
    - Added all new icons and logos
- **New Brand Guidelines**
  - argxs
  - Twitch
  - FreeCAD
  - Bun
- **New Tags**
  - **[New]** Real Estate
    - Home
    - Nybolig
  - **[New]** Software
    - Unreal Engine
    - Vivaldi
    - Atom
    - balena
    - Native Instruments
    - Arduino
    - Figma
    - Spotify
    - Windows
    - Visual Studio
    - Vim
    - Steam
    - Ubisoft
    - TikTok
    - Tidal
    - Threads
    - TeamViewer
    - Riot Games
    - NZXT
    - NVIDIA
    - MobilePay
    - Microsoft
    - Malwarebytes
    - Docker
    - Discord
    - CrowdStrike
    - Bluesky

## Bug Fixes
### Hotfix
- Fixed an issue where scrolling the page would cause an incorrect position of the canvas cursor on [Colors#Color-Picker](https://argxs.dev/colors/color-picker). Along with this hotfix, the code has been greatly cleaned up on [Colors#Color-Picker](https://argxs.dev/colors/color-picker) to avoid similar issues in the future. A general testing *should* have been performed before release. [I](https://github.com/thorbm1500) apologize for any inconvenience this might have caused.
### Sidebar
- A delay has been added to the animation, which should make the sidebar less glitchy
### Changelogs
- Fixed an issue causing different font weights on links

## Dependencies
- **[New]** vite-plus: *0.2.7*
- @humanspeak/svelte-markdown: *1.8.4 ➜ 1.8.6*
- @sveltejs/kit: *2.70.0 ➜ 2.70.2*
- @sveltejs/vite-plugin-svelte: *7.2.0 ➜ 7.3.0*
- svelte: *5.56.6 ➜ 5.56.9*
- publint: *0.3.21 ➜ 0.3.23*
- globals: *17.7.0 ➜ 17.11.0*
- typescript-eslint: *8.65.0 ➜ 8.67.0*
- highlight.js: *11.11.1 ➜ 11.12.0*
- @highlight.js/cdn-assets: *11.11.1 ➜ 11.12.0*