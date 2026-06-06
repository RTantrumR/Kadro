# Kadro — Tampermonkey userscripts for kadroland.com / 7eminar.ua editors

This folder is the working tree of the GitHub repo **`RTantrumR/Kadro`**. It ships Tampermonkey userscripts that editors install once and then receive auto-updates for. Part of the wider `KadroFrames` workspace (see `../CLAUDE.md`).

## Scripts

- **`kadro-helper.user.js`** (repo root) — "detox": hides ad/promo bloat for editors on kadroland.com and 7eminar.ua. A `BLOAT` registry (`key → {label, selectors}`) injects `display:none`; a floating broom-button panel toggles each entry, persisted via `GM_setValue`. Also a Ctrl+K → insert-link shortcut on `/news/editor`.
- **`comment-templates/kadro-comment-templates.user.js`** — injects a template-picker dropdown + ⚙ editor into `.comment-form` on kadroland.com, styled to match the site's `.k-btn` pills (40px, radius 25px, red hover). Templates live in `localStorage['kadro_templates']` (migrated once from the old `kadro_templates_v6` key); the in-code `DEFAULT_TEMPLATES` is a fallback only, so editing it does **not** overwrite templates a user has already saved.

`*.html` and `*_files/` are reference page snapshots used to find selectors — gitignored.

## Auto-update mechanics (important)

Each script's `@updateURL`/`@downloadURL` point at its `raw.githubusercontent.com/RTantrumR/Kadro/main/...` path. Gotchas, learned the hard way:

1. **Bump `@version` on every change.** Tampermonkey only installs an update when the version number *increases*. A content change with the same version is invisible to installed copies.
2. **Tampermonkey checks the *installed* copy's `@updateURL`, not the repo's.** If you rename/move a script (changing its raw path), existing installs keep polling the old (now 404) URL and silently find nothing — they must be **reinstalled once** from the new raw URL to repair the channel. After that, version-bump auto-update works again.
3. A locally hand-installed copy (loaded from a file, not the raw URL) has no working update channel until reinstalled from the raw URL.
4. CDN cache on raw.githubusercontent can lag a few minutes after a push.

## Workflow for a change

1. Edit the script. 2. Bump `@version`. 3. Commit + push to `main`. 4. In Tampermonkey → the script → "Check for userscript updates".

Author: Tantrum.
