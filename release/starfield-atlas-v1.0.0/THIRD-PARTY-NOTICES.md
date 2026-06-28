# Third-Party Notices

Starfield Starmap Explorer v1.0.0 bundles no npm packages. The HTML file loads
these external resources when online (or from browser cache):

| Resource | Provider | Licence | URL |
|----------|----------|---------|-----|
| Tailwind CSS | Tailwind Labs | MIT | https://cdn.tailwindcss.com |
| Font Awesome 6 | Fonticons, Inc. | Font Awesome Free Licence | https://fontawesome.com/license/free |
| Inter font | Google Fonts | SIL Open Font Licence 1.1 | https://fonts.google.com/specimen/Inter |

## Offline use

After the first successful load with network access, browsers may cache CDN
assets. For fully air-gapped use, self-host the above files and update the
`<script>` / `<link>` tags in the HTML (advanced — not required for typical
players).

## Trademarks

Font Awesome is a trademark of Fonticons, Inc. Starfield and Bethesda are
trademarks of ZeniMax Media / Bethesda Softworks.
