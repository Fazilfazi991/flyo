# New group package pages

These four packages reuse `packages/detail.html`, `package.js`, `package.css`,
the existing cards, currency selector and WhatsApp enquiry flow. No backend
changes or new enquiry system are needed.

## Routes

- `/packages/thailand-bangkok-pattaya-group-package`
- `/packages/japan-tokyo-osaka`
- `/packages/scandinavian-wonders`
- `/packages/rovaniemi-helsinki-group-tour`

Content lives in `data/group-packages.js`, exported through `data/packages.js`.
The build generates HTML routes, page titles, descriptions and initial headings.
The public store appends these release packages when the existing CMS/local
catalogue does not yet contain them; matching existing records take precedence.
These static release entries are visible until removed from that module or
replaced by a matching CMS/local record. No database records were published.

## Files changed

- `data/group-packages.js`: four package records and supplied commercial details.
- `data/packages.js`: includes the new records in the existing catalogue.
- `data/package-store.js`: keeps new release records visible alongside stored packages.
- `data/package.json`: identifies browser data files as ES modules for the build.
- `package.js`: renders supplied facts, policy sections, related packages and image descriptions.
- `package.css`: spacing between the new policy sections.
- `packages/listing.js`: matching cards, summaries, factual badges and price-on-request handling.
- `styles.css`: two small rules for card summaries and request-price text.
- `scripts/build-static.js`: builds routes from the actual catalogue and supplies page metadata.
- `packages/group-tour-images/`: eight generated destination images plus four card variants.
- `tests/packages.test.mjs`: four content, image and generated-route checks.
- `docs/new-group-packages.md`: source uncertainties, asset provenance and preview instructions.

## Verification

The static build produces 23 package routes: 19 existing and four new. All four
automated tests, JavaScript syntax checks and `git diff --check` passed. Browser
inspection covered desktop and 390px mobile layouts, all four detail pages,
listing cards and search, itinerary accordion interaction, and the existing
WhatsApp office chooser. No messages were sent and nothing was deployed.

## Source and items needing confirmation

Source: the user's package brief supplied on 26 October 2026. The referenced
DOCX/PDF originals were not attached and were not available in the attachment
directory. No commercial terms have been inferred from their filenames.

- Thailand: the main dates end 02 December 2026 but return flights are quoted
  for 03 December 2026. Both appear, with an explicit confirmation note.
- Thailand: AED 3699 is the quoted Air Arabia starting fare; the adult twin-share
  quote is AED 3899. Child-with-bed pricing and Flydubai pricing remain separate.
- Japan: one page only. The full supplier cancellation/terms wording, including
  JPY / ROE clauses, still needs the original document. A neutral fallback appears.
- Scandinavia: exact supplier inclusions, exclusions, payment policy and terms
  still need the original document. Only the supplied accommodation/services
  summary is listed as confirmed; the rest says to contact Flyo. Flights remain
  TBA, including clarification of fare inclusion for Bergen–Copenhagen.
- Rovaniemi: no year or selling price was supplied. Dates remain `28 Nov – 02 Dec`
  and price remains `Price on request`. AED 3000 is clearly a deposit, not a fare.
- Northern Lights sightings are explicitly not guaranteed.

## Images

Optimized images live in `packages/group-tour-images/`. Each package has a
1536 × 1024 WebP hero and a 768 × 512 card version. Supporting city photographs
use the same folder; Thailand also reuses the existing Thailand beach/night
images. Meaningful descriptions are used for hero, gallery and itinerary visuals.

Generated with the built-in image-generation tool, using the prompt set:
premium, realistic tourism editorial photography; wide landscape composition;
natural vivid colors; no logos, text overlays, watermarks, collage or invented
landmarks. Scenes: Bangkok/Wat Arun at sunset; Mount Fuji/Lake Ashi in April;
Norwegian fjord near Gudvangen; snowy Rovaniemi cabin with Northern Lights;
Tokyo skyline; Dotonbori, Osaka; wintry Helsinki waterfront; Stockholm waterfront.
These are illustrative destination visuals, not photographs of booked hotels.

## Local preview and build

No dependencies are required for the site or its static build.

```sh
node preview-server.js
node scripts/build-static.js
node --test tests/packages.test.mjs
```

Preview at `http://127.0.0.1:4173`. Deploy `dist` using the existing Vercel
configuration. The support integration added later is documented in `README.md`;
package facts, prices, dates and images remain unchanged by that integration.
