# v0.6.0
#### 2026-05-14

## Image Processing
argxs now offers **PNG**, **WEBP**, and **JPEG** versions available for download for all icons.
These filetypes are generated automatically from the SVGs, and thus will always be of high quality.
<br>
The process starts by generating a PNG from the SVG. This is done with the help of [Inkscape](https://inkscape.org).
A minimum width/height of 1000px is first calculated, and ensured, and then the conversion is made with [Inkscape](https://inkscape.org)'s CLI
```powershell
inkscape -w width -h height --export-png-compression=7 --export-type=png svg_path -o png_path
```
<br>The rest of the images are generated with the newly available [native image processing pipeline in Bun](https://bun.com/docs/runtime/image).
```typescript
await PNG.image().webp({ lossless: true }).write(icon.path);
await PNG.image().jpeg({ quality: 80 }).write(icon.path);
```
<br>The entire process is automatic. A CRON job is scheduled to run at every day at midnight, checking and processing
all icons. This is *currently* redundant, but is set up in advance, for future structure changes, as all resources are set
to be moved to a separate repository. This might seem like a waste of resources, but the whole process takes less than
5 seconds from start to finish, when all assets have already been generated.
The reason for moving to a separate repository is due to a simple human oversight, of how many resources there eventually would be...

## Added
- **Icons:**
    - Icon containers now blink during loading, to give the user a feeling of progress

## Changed
- **Icons:**
  - **Good to know** section updated

## Dependencies
- **[New]** highlight.js: *11.11.1*
- svelte: *5.55.5 ➜ 5.55.7*
- @sveltejs/kit: *2.59.1 ➜ 2.60.1*
- bun: *1.3.13 ➜ 1.3.14*
- @types/bun: *1.3.13 ➜ 1.3.14*
- @types/node: *25.7.0 ➜ 25.8.0*
- publint: *0.3.20 ➜ 0.3.21*
- vite *8.0.12 ➜ 8.0.13*
- @humanspeak/svelte-markdown: *1.4.5 ➜ 1.5.0*