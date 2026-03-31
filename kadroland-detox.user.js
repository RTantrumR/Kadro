// ==UserScript==
// @name         Kadroland Detox
// @namespace    https://kadroland.com/
// @version      1.0
// @description  Приховує рекламний та промо-контент на kadroland.com для редакторів
// @author       kadroland-tools
// @match        https://kadroland.com/*
// @match        https://www.kadroland.com/*
// @match        https://7eminar.ua/*
// @match        https://www.7eminar.ua/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @updateURL    https://raw.githubusercontent.com/RTantrumR/Kadro/main/kadroland-detox.user.js
// @downloadURL  https://raw.githubusercontent.com/RTantrumR/Kadro/main/kadroland-detox.user.js
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // ── Bloat definitions ──────────────────────────────────────────────
    const BLOAT = {
        pushNotifications: {
            label: 'Push-сповіщення',
            selectors: ['.push-notification-prompt'],
        },
        aiBanner: {
            label: 'AI-банер (верх сторінки)',
            selectors: ['.header-banner'],
        },
        promoPopups: {
            label: 'Промо-попапи (банери)',
            selectors: ['section.banners > .popup'],
        },
        aiButton: {
            label: 'AI-кнопка (праворуч знизу)',
            selectors: ['.layout__container--widgets--ai-button'],
        },
        phoneButton: {
            label: 'Кнопка дзвінка (ліворуч знизу)',
            selectors: ['#bingc-phone-button'],
        },
        messageButton: {
            label: 'Кнопка повідомлення (ліворуч знизу)',
            selectors: ['bwchat#bwc-wrap', '#bwc-wrap'],
        },
        webinarsWidget: {
            label: 'Безкоштовні вебінари (бічна панель)',
            selectors: ['.widget-webinars'],
        },
        adBanner: {
            label: 'Рекламний банер / калькулятор',
            selectors: ['.ad-banner'],
        },
        promoModal: {
            label: 'Промо-модальне вікно (підписка)',
            selectors: ['div.modal[style*="pop_up"]'],
        },
    };

    // ── Settings (persisted via Tampermonkey storage) ──────────────────
    function isEnabled(key) {
        return GM_getValue('detox_' + key, true);
    }
    function setEnabled(key, value) {
        GM_setValue('detox_' + key, value);
    }

    // ── CSS injection ─────────────────────────────────────────────────
    const styleEl = document.createElement('style');
    styleEl.id = 'kadroland-detox-rules';
    (document.head || document.documentElement).appendChild(styleEl);

    function applyCSS() {
        const selectors = [];
        for (const [key, { selectors: sels }] of Object.entries(BLOAT)) {
            if (isEnabled(key)) selectors.push(...sels);
        }
        styleEl.textContent = selectors.length
            ? selectors.join(',\n') + ' { display: none !important; }\n'
            : '';
    }

    applyCSS();

    // ── Settings panel (built after DOM is ready) ─────────────────────
    function buildPanel() {
        const panel = document.createElement('div');
        panel.id = 'kd-detox-panel';

        // ── Panel styles ──
        const panelCSS = document.createElement('style');
        panelCSS.textContent = `
            #kd-detox-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.95);
                z-index: 2147483647;
                background: #fff;
                border-radius: 16px;
                box-shadow: 0 12px 40px rgba(0,0,0,0.22);
                padding: 0;
                width: 360px;
                font-family: 'Roboto', 'Segoe UI', sans-serif;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s, transform 0.2s;
            }
            #kd-detox-panel.kd-open {
                opacity: 1;
                pointer-events: auto;
                transform: translate(-50%, -50%) scale(1);
            }
            #kd-detox-overlay {
                position: fixed;
                inset: 0;
                z-index: 2147483646;
                background: rgba(0,0,0,0.3);
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s;
            }
            #kd-detox-overlay.kd-open {
                opacity: 1;
                pointer-events: auto;
            }
            .kd-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 18px 22px 12px;
                border-bottom: 1px solid #f0f0f0;
            }
            .kd-header h2 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                color: #232323;
            }
            .kd-close {
                background: none;
                border: none;
                font-size: 22px;
                cursor: pointer;
                color: #999;
                padding: 0 2px;
                line-height: 1;
            }
            .kd-close:hover { color: #333; }
            .kd-list {
                padding: 8px 0;
                max-height: 400px;
                overflow-y: auto;
            }
            .kd-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 22px;
                cursor: pointer;
                user-select: none;
                transition: background 0.1s;
            }
            .kd-item:hover { background: #fafafa; }
            .kd-item-label {
                font-size: 14px;
                color: #333;
            }
            /* Toggle switch */
            .kd-toggle {
                position: relative;
                width: 42px;
                height: 24px;
                flex-shrink: 0;
                margin-left: 12px;
            }
            .kd-toggle input {
                opacity: 0;
                width: 0;
                height: 0;
                position: absolute;
            }
            .kd-toggle-track {
                position: absolute;
                inset: 0;
                background: #ddd;
                border-radius: 12px;
                transition: background 0.2s;
            }
            .kd-toggle input:checked + .kd-toggle-track {
                background: #ed3434;
            }
            .kd-toggle-knob {
                position: absolute;
                top: 2px;
                left: 2px;
                width: 20px;
                height: 20px;
                background: #fff;
                border-radius: 50%;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                transition: transform 0.2s;
            }
            .kd-toggle input:checked ~ .kd-toggle-knob {
                transform: translateX(18px);
            }
            .kd-footer {
                padding: 10px 22px 14px;
                border-top: 1px solid #f0f0f0;
                display: flex;
                gap: 10px;
            }
            .kd-footer button {
                flex: 1;
                padding: 8px 0;
                border: none;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.15s;
            }
            .kd-btn-all {
                background: #ed3434;
                color: #fff;
            }
            .kd-btn-all:hover { background: #d42d2d; }
            .kd-btn-none {
                background: #f0f0f0;
                color: #555;
            }
            .kd-btn-none:hover { background: #e4e4e4; }

            /* Trigger button */
            #kd-detox-trigger {
                position: fixed;
                bottom: 12px;
                right: 12px;
                z-index: 2147483645;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 2px solid #ed3434;
                background: #fff;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                transition: transform 0.15s, box-shadow 0.15s;
                font-size: 20px;
                line-height: 1;
                padding: 0;
            }
            #kd-detox-trigger:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 14px rgba(0,0,0,0.2);
            }
        `;
        document.head.appendChild(panelCSS);

        // ── Overlay ──
        const overlay = document.createElement('div');
        overlay.id = 'kd-detox-overlay';
        document.body.appendChild(overlay);

        // ── Panel HTML ──
        const header = document.createElement('div');
        header.className = 'kd-header';
        header.innerHTML = '<h2>Kadroland Detox</h2>';
        const closeBtn = document.createElement('button');
        closeBtn.className = 'kd-close';
        closeBtn.textContent = '\u00D7';
        header.appendChild(closeBtn);

        const list = document.createElement('div');
        list.className = 'kd-list';

        const toggleInputs = {};

        for (const [key, { label }] of Object.entries(BLOAT)) {
            const item = document.createElement('label');
            item.className = 'kd-item';

            const labelSpan = document.createElement('span');
            labelSpan.className = 'kd-item-label';
            labelSpan.textContent = label;

            const toggle = document.createElement('div');
            toggle.className = 'kd-toggle';
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = isEnabled(key);
            toggleInputs[key] = input;
            const track = document.createElement('div');
            track.className = 'kd-toggle-track';
            const knob = document.createElement('div');
            knob.className = 'kd-toggle-knob';

            toggle.append(input, track, knob);
            item.append(labelSpan, toggle);
            list.appendChild(item);

            input.addEventListener('change', () => {
                setEnabled(key, input.checked);
                applyCSS();
            });
        }

        const footer = document.createElement('div');
        footer.className = 'kd-footer';
        const btnAll = document.createElement('button');
        btnAll.className = 'kd-btn-all';
        btnAll.textContent = 'Приховати все';
        const btnNone = document.createElement('button');
        btnNone.className = 'kd-btn-none';
        btnNone.textContent = 'Показати все';
        footer.append(btnAll, btnNone);

        btnAll.addEventListener('click', () => {
            for (const [key, input] of Object.entries(toggleInputs)) {
                input.checked = true;
                setEnabled(key, true);
            }
            applyCSS();
        });
        btnNone.addEventListener('click', () => {
            for (const [key, input] of Object.entries(toggleInputs)) {
                input.checked = false;
                setEnabled(key, false);
            }
            applyCSS();
        });

        panel.append(header, list, footer);
        document.body.appendChild(panel);

        // ── Trigger button ──
        const trigger = document.createElement('button');
        trigger.id = 'kd-detox-trigger';
        trigger.title = 'Kadroland Detox';
        trigger.innerHTML = '&#x1F9F9;'; // broom emoji
        document.body.appendChild(trigger);

        // ── Open / close ──
        function openPanel() {
            panel.classList.add('kd-open');
            overlay.classList.add('kd-open');
        }
        function closePanel() {
            panel.classList.remove('kd-open');
            overlay.classList.remove('kd-open');
        }
        trigger.addEventListener('click', openPanel);
        closeBtn.addEventListener('click', closePanel);
        overlay.addEventListener('click', closePanel);
    }

    // ── Tampermonkey menu fallback ────────────────────────────────────
    GM_registerMenuCommand('Відкрити Detox панель', () => {
        const panel = document.getElementById('kd-detox-panel');
        const overlay = document.getElementById('kd-detox-overlay');
        if (panel && overlay) {
            panel.classList.add('kd-open');
            overlay.classList.add('kd-open');
        }
    });

    // ── Ctrl+K → Insert link (Quill editor shortcut) ────────────────
    function initCtrlK() {
        document.addEventListener('keydown', (e) => {
            if (!(e.ctrlKey && e.key === 'k')) return;

            const linkBtn = document.querySelector('button.ql-link');
            if (!linkBtn) return;

            // Only act when focus is inside the Quill editor area
            const active = document.activeElement;
            const editorArea = active && active.closest('.ql-editor, .ql-container, [contenteditable]');
            if (!editorArea) return;

            e.preventDefault();
            e.stopPropagation();
            linkBtn.click();
        }, true); // capture phase — before the browser's default Ctrl+K
    }

    // ── Wait for DOM ──────────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { buildPanel(); initCtrlK(); });
    } else {
        buildPanel();
        initCtrlK();
    }
})();
