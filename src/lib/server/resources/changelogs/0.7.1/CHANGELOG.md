# v0.7.1
#### 2026-05-26

## New Features
### Search
It is now possible to search for the exact icon you're looking for, when browsing the icons section! This is done with a simple implementation, and thus does not have any smart features, like fuzzy search.
This is partially since the entire search is done client side.
### Persistent Settings
Multiple settings now carry over between sessions, for a better user experience. The settings are stored in **Local Storage** with keys like `icons#background_light`. 
From a privacy perspective, there is absolutely nothing to be afraid of. There are no trackers, 3rd parties or other ill-intended methods in use. 
Just a simple cross session storage, so you don't have to change from 48 icons per page to 24, *every single time* you open the page.
All persistent settings are listed below.
- **Icons**
  - Highlighted Icon Modal - Background Light
  - Items per page (24, 48 or 96)
  - Icon Sorting (None, Alphabet, Date) Incl. Order

**Keep in mind: Your browser's Local Storage is not wiped when deleting cookies and/or cache. If you wish to wipe the Local Storage, it can be found at<br>
`CTRL + SHIFT + I ➜ Application ➜ Storage ➜ Local Storage ➜ Clear All`<br>
or<br>
`Right Click ➜ Inspect ➜ Application ➜ Storage ➜ Local Storage ➜ Clear All`**
### <br>Animated Only
The first animated icon was added in Version 0.7.0, which now prompts the need for an `Animated Only` button

## 8 New [Brand Icons](https://argxs.com/icons/brands)
- **[New]** React
- **[New]** Django
- **[New]** Spring Boot
- **[New]** Vue.js
- **[New]** New Relic
- **[New]** SSL
- **[New]** CrowdStrike
- **[New]** Oscar Biludlejning
- **[New]** MobilePay
  - Incl. Vipps MobilePay
- **[New]** Raspberry Pi
  - Incl. Powered By Raspberry Pi
  - Incl. Astro Pi
    - Incl. MISSION ZERO
    - Incl. SPACE LAB
- **[New]** ESA

## 15 New [Flag Icons](https://argxs.com/icons/flags)
- States from the United States of America
  - Alabama
  - Alaska
  - Arizona
  - Arkansas
  - California
  - Colorado
  - Connecticut
  - Delaware
  - Florida
  - Georgia
  - Hawaii
  - Idaho
  - Illinois
  - Indiana
  - Iowa

## Minor Changes
- Updated design of theme-switch button
- Minor accessibility improvement regarding descriptions of SVGs for visually impaired users
- SVG decoding is now defined as async instead of letting the browser decide
- Several bug fixes
### Icons
- Updated header design

## Dependencies
- svelte: *5.55.9 ➜ 5.55.10*
- @humanspeak/svelte-markdown: *1.5.2 ➜ 1.5.3*
- typescript-eslint: *8.59.4 ➜ 8.60.0*