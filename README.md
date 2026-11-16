# VEYRA website

A one-page download site in VEYRA's own dark liquid-glass theme: plain HTML, CSS and JavaScript, with no build step and no dependencies.

```
website/
  index.html        the page
  style.css         the theme (colours copied from the app's Themes/Colors.xaml)
  script.js         release details, mobile menu, scroll reveals, checksum copy
  favicon.ico       the app icon
  assets/           logo and app screenshots (no personal details in them)
  downloads/        put the installer here (not committed to git)
```

## Publish it

Upload the whole `website` folder to any static host: GitHub Pages, Netlify, Cloudflare Pages, or your own server. Put `VEYRA-1.1.0-x64.msi` in `downloads/` next to it.

If your host limits file sizes (the installer is 85 MB), upload the MSI somewhere else, such as GitHub Releases, and paste that link into `url` in `script.js`.

## Release a new version

1. Build it: `powershell -File tools/build-installer.ps1`.
2. Copy the new MSI from `dist/` into `website/downloads/`.
3. Update `RELEASE` at the top of `script.js`. Get the size and checksum with:

   ```powershell
   Get-FileHash dist\VEYRA-<version>-x64.msi -Algorithm SHA256
   ```

The page fills in the version, file name, size and checksum everywhere from `RELEASE`. The same values are also written in `index.html`, so the page still reads correctly without JavaScript; update those too.

## Preview locally

```powershell
node tools/serve-website.mjs
```

Then open http://localhost:8090.
