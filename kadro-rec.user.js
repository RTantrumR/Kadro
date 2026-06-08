// ==UserScript==
// @name         kadro-rec
// @namespace    https://kadroland.com/
// @version      2.0
// @description  Personal tweaks — robust 2-col recommendations, colour-coded category pills in cards + article header (Консультація/Стаття/Мінікурс + injected "Новина"), tone down homepage "Джерело" source link, hide cookie banner & calendar-widget button, 2-item popular widget
// @author       Tantrum
// @match        https://kadroland.com/*
// @match        https://www.kadroland.com/*
// @match        https://7eminar.ua/*
// @match        https://www.7eminar.ua/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/RTantrumR/Kadro/main/kadro-rec.user.js
// @downloadURL  https://raw.githubusercontent.com/RTantrumR/Kadro/main/kadro-rec.user.js
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // ── CSS (everything that's pure styling / hiding) ──────────────────
    const css = `
        /* Recommendations: fill the column + 2 columns instead of one stack */
        .recommendations { max-width: none !important; }
        .recommendations-list {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
            gap: 16px 20px !important;
            /* stretch: both cards in a row share the tallest one's height, so a
               shorter card no longer leaves a page-background gap beneath it */
            align-items: stretch !important;
        }
        @media (max-width: 760px) {
            .recommendations-list { grid-template-columns: minmax(0, 1fr) !important; }
        }
        /* Each card fills its grid cell, top to bottom, as a flex column so the
           action bar can be pinned to the bottom regardless of text length */
        .recommendations .card-news {
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
        }
        /* Body grows to absorb the height difference → the action bar drops to
           the bottom and bars line up across the row (no mid-card gap) */
        .recommendations .card-news__body { width: 100% !important; flex: 1 1 auto !important; }
        /* Cards WITH a thumbnail: text (flexible) + fixed 129px picture column.
           minmax(0,1fr) lets the text track actually shrink/wrap instead of
           refusing to go below its content width and shoving the thumbnail. */
        .recommendations .card-news--with-image .card-news__body {
            grid-template-areas: "info info" "link picture" !important;
            grid-template-columns: minmax(0, 1fr) 129px !important;
            grid-template-rows: auto auto !important;
        }
        /* Cards WITHOUT a thumbnail: one full-width column so text uses all space */
        .recommendations .card-news:not(.card-news--with-image) .card-news__body {
            grid-template-areas: "info" "link" !important;
            grid-template-columns: minmax(0, 1fr) !important;
        }
        /* Text block + its contents take the full width they're given */
        .recommendations .card-news__link { min-width: 0 !important; width: 100% !important; }
        .recommendations .card-news__title,
        .recommendations .card-news__description { width: 100% !important; }
        /* Keep every thumbnail the same size & top-aligned with the title so
           ragged image ratios don't stagger the rows */
        .recommendations .card-news__picture-link {
            width: 129px !important;
            height: 77px !important;
            align-self: start !important;
        }
        .recommendations .card-news__picture-link img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
        }
        /* Re-create the native round-pill visual for our injected "Новина" tag.
           The site's .label styling is Vue-scoped (.label[data-v-00e79cfa]{…}),
           an attribute our injected node can't carry — so reproduce the base
           pill from K-Label.css verbatim. */
        .kf-pill {
            align-items: center;
            border-radius: 10px;
            display: inline-flex;
            flex-direction: row;
            font-size: 12px;
            font-weight: 500;
            gap: 6px;
            justify-content: center;
            line-height: 12px;
            min-height: 20px;
            min-width: 31px;
            padding: 3px 8px;
            text-transform: uppercase;
            width: max-content;
        }
        @media (min-width: 1066px) {
            .kf-pill { font-size: 10px; }
        }
        /* "Календар кадровика" widget: drop the redundant bottom button
           (the widget title already links to the same /personal-calendar). */
        .calendar-widget a.k-btn { display: none !important; }
        /* Tone down the homepage "Джерело" source link that points at the bare
           front page — it shouldn't out-shout the real article links. Covers
           both the bare <a> (red from site link styling) and the
           <u style="color:#ed3434"> wrapper variant (needs !important), on
           both kadroland.com and 7eminar.ua. */
        .article__content a[href="https://kadroland.com/"],
        .article__content a[href="https://www.kadroland.com/"],
        .article__content a[href="https://7eminar.ua/"],
        .article__content a[href="https://www.7eminar.ua/"],
        .article__content u:has(> a[href="https://kadroland.com/"]),
        .article__content u:has(> a[href="https://www.kadroland.com/"]),
        .article__content u:has(> a[href="https://7eminar.ua/"]),
        .article__content u:has(> a[href="https://www.7eminar.ua/"]) {
            color: #c97070 !important;            /* muted red — still red, just calmer than #ed3434 */
            text-decoration-color: #e3b0b0 !important;
        }
        /* Hide cookie banner */
        .cookie-banner { display: none !important; }
        /* "Популярне" widget: show 2 articles instead of 3 */
        .widget-popular .widget-content__link:nth-of-type(n+3) { display: none !important; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);

    // ── Category pills (needs JS: CSS can't match by text or add missing pills) ──
    const PILL_COLORS = {
        'Консультація': { bg: '#E7F1FF', fg: '#2563EB' },
        'Стаття':       { bg: '#E6F7EC', fg: '#1E9E57' },
        'Мінікурс':     { bg: '#FAE8FF', fg: '#A21CAF' }, // pink-purple
    };
    const NOVINA = { bg: '#FFF3CD', fg: '#8A6D00' };

    function paint(label, c) {
        label.style.setProperty('background-color', c.bg, 'important');
        label.style.setProperty('color', c.fg, 'important');
    }

    function novinaTags() {
        const tags = document.createElement('div');
        tags.className = 'card-news__tags';
        const label = document.createElement('div');
        label.className = 'label label--custom kf-pill kf-novina';
        paint(label, NOVINA);
        const span = document.createElement('span');
        span.className = 'label__text';
        span.textContent = 'Новина';
        label.appendChild(span);
        tags.appendChild(label);
        return tags;
    }

    function processCards(root) {
        const scope = root.querySelectorAll ? root : document;

        // Recolour known category pills wherever they live — both in the
        // recommendation cards (.card-news__tags) and in the article header
        // (.article__tags, e.g. the "Мінікурс" tag). Idempotent.
        scope.querySelectorAll('.card-news__tags .label, .article__tags .label').forEach(label => {
            const t = label.querySelector('.label__text');
            const c = t && PILL_COLORS[t.textContent.trim()];
            if (c) paint(label, c);
        });

        // Recommendation cards with no pill at all → inject a "Новина" pill.
        scope.querySelectorAll('.card-news__info').forEach(info => {
            if (info.querySelector('.card-news__tags')) return;
            const cat = info.querySelector('.card-news__category');
            const pill = novinaTags();
            if (cat) info.insertBefore(pill, cat);
            else info.prepend(pill);
        });
    }

    // ── Run after DOM is ready, then watch for SPA-loaded cards ─────────
    function start() {
        processCards(document);
        const obs = new MutationObserver((muts) => {
            for (const m of muts) {
                for (const node of m.addedNodes) {
                    if (node.nodeType === 1) processCards(node.parentNode || node);
                }
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
