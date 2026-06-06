// ==UserScript==
// @name         Kadroland Helper
// @namespace    https://kadroland.com/
// @version      1.8
// @description  Advanced template editor with UTF-8 Export and Code Generator
// @author       Tantrum
// @match        https://kadroland.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/RTantrumR/Kadro/main/comment-templates/kadro-comment-templates.user.js
// @downloadURL  https://raw.githubusercontent.com/RTantrumR/Kadro/main/comment-templates/kadro-comment-templates.user.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'kadro_templates';
    const LEGACY_KEY = 'kadro_templates_v6'; // pre-rename key; read once to migrate saved templates
    const DEFAULT_TEMPLATES = [
        {
            label: "💙🧡 Після короткої відповіді",
            text: "💙 Долучайтеся до наших безкоштовних вебінарів або ставайте нашим передплатником в пакеті [«Професіонал»](https://kadroland.com/subscribe). Це дасть можливість без обмежень ставити запитання нашим експертам і отримувати відповіді від 15 хвилин. А вебінари та курси, що входять до пакета, допоможуть завжди бути в курсі всіх актуальних змін.💙"
        },
        {
            label: "🤖 AI (Під сторінкою АІ)",
            text: "Добрий день! Запитання потрібно ставити нашому АІ-консультанту (скріпка АІ у правому нижньому куті), або через кнопку ПОСТАВИТИ ЗАПИТАННЯ ☝️ на малюку зверху. Також можете натиснути [тут](https://kadroland.com/aikonsultant?chat=open) і поставити питання у віконці що відкриється"
        },
        {
            label: "🤖 AI (Під рекламною статтею АІ)",
            text: "Добрий день, пані...! Запитання потрібно ставити нашому АІ-консультанту (скріпка АІ у правому нижньому куті), або через кнопку ПОСТАВИТИ ЗАПИТАННЯ ☝ на малюку зверху. Також ви можете звернутись до спеціалістів з сервісу [Особистий консультант](https://kadroland.com/events/259/683) або замовити [Індивідуальну консультацію](https://kadroland.com/online-konsultaciya) у наших провідних спеціалістів. Сервіс працює цілодобово, 24/7, а відповіді надаються від 15 хвилин!"
        },
        {
            label: "🤖 Хороше запитання – задайте його АІ",
            text: "Дуже хороше запитання - дякуємо, що задали його! До речі, наш [AI-Консультант 🤖](https://kadroland.com/?chat=open) уже вміє детально пояснювати саме такі ситуації 😉 Ви можете поставити йому запитання у довільній формі, і він дасть точну відповідь за кілька секунд."
        },
        {
            label: "🤖 Власна думка AI",
            text: "Наш [AI-Консультант 🤖](https://kadroland.com/?chat=open) вже має на це власну думку 😊 Він щодня вивчає оновлення у нормах і дає поради на основі актуальних документів. Спробуйте - можливо, це саме те рішення, яке ви шукаєте!"
        },
        {
            label: "📚 Без запитання (Запрошення на вебінари)",
            text: "💙 Дякуємо, що поділилися! Запрошуємо вас долучитися до наших безкоштовних [вебінарів](https://kadroland.com/free-webinars). Корисні знання та актуальна інформація вже чекають на вас! 💙"
        },
        {
            label: "✍️ Діляться кейсом",
            text: "🧡 Дякуємо, що ділитеся своїм досвідом — для нас та наших читачів це справді важливо! 😊 Долучайтеся до наших безкоштовних вебінарів або ставайте нашим передплатником в пакеті [«Професіонал»](https://kadroland.com/subscribe). Це дасть можливість без обмежень ставити запитання нашим експертам і отримувати відповіді від 15 хвилин. А вебінари та курси, що входять до пакета, допоможуть завжди бути в курсі всіх актуальних змін."
        },
        {
            label: "❤️ Дякують 1(Сервіс ОК + Швидкість AI)",
            text: "Щиро дякуємо, що ви з нами! Ваша довіра та підтримка надихають нас щодня. 💙 Наші експерти щодня відповідають на ваші запитання у Сервісі «Особистий консультант» 💬 Вебінари, курси та новини допомагають бути в курсі всіх змін. А тепер ще швидше — [AI-Консультант 🤖](https://kadroland.com/?chat=open) kadroland!. Передплачуйте «Професіонал» зі [знижкою](https://kadroland.com/subscribe)"
        },
        {
            label: "❤️ Дякують 2 (Підписка на професіонал)",
            text: "Дякуємо Вам за приділений час! 💙 Консультації від експертів, вебінари, курси й новини — усе для кадровиків на kadroland.com. А тепер ще й [AI-Консультант 🤖](https://kadroland.com/?chat=open). Натисніть на посилання та отримайте миттєву відповідь. Передплачуйте «Професіонал» зі [знижкою](https://kadroland.com/subscribe)"
        },
        {
            label: "❤️ Дякують 3 (Експерти поруч)",
            text: "Дякуємо Вам за теплі слова! ❤️ Ваші експерти завжди поруч 🤝 Консультації, вебінари, курси — і тепер новинка [AI-Консультант 🤖](https://kadroland.com/?chat=open) kadroland. Натисніть на посилання та отримайте миттєву відповідь. Передплачуйте «Професіонал» зі [знижкою](https://kadroland.com/subscribe)"
        },
        {
            label: "💪 Складне запитання 1 (ОК)",
            text: "Добрий день! Дякуємо за запитання. Ваша ситуація потребує більш повноцінної консультації. Радимо звернутись до спеціалістів з сервісу [«Особистий консультант»](https://kadroland.com/events/259/683) або замовити [Індивідуальну консультацію](https://kadroland.com/online-konsultaciya) у наших провідних спеціалістів. Сервіс працює цілодобово, 24/7, а відповіді надаються вже від 15 хвилин! Також можете спробувати поставити ваше запитання нашому [AI-Консультанту 🤖](https://kadroland.com/?chat=open). Гарного дня і приємного навчання! 📝"
        },
        {
            label: "💪 Складне запитання 2 (підписка)",
            text: "Для отримання кваліфікованої відповіді рекомендуємо передплатити доступ до нашої платформи в пакеті [«Професіонал»](https://kadroland.com/subscribe). Це дасть можливість без обмежень ставити запитання нашим експертам і отримувати відповіді від 15 хвилин. А вебінари та курси, що входять до пакету, допоможуть завжди бути в курсі всіх актуальних змін. Також можете спробувати поставити ваше запитання нашому [AI-Консультанту 🤖](https://kadroland.com/?chat=open)."
        },
        {
            label: "🥺 Помилка в контенті",
            text: "Добрий день! Вдячні за Вашу уважність. Вже найближчим часом ми виправимо дану помилку на сайті. Дякуємо, що допомагаєте нам ставати кращими! 🥰"
        },
        {
            label: "🥺 Помилка вже виправлена",
            text: "Добрий день! Вдячні за Вашу уважність. Вже виправили цю неточність на сайті. Дякуємо, що допомагаєте нам ставати кращими! 🥰"
        },
        {
            label: "🙈 Питання не за адресою",
            text: "Вітаю! Наші консультанти та експерти відповідають на питання з кадрового обліку, військового обліку за місцем роботи і бронювання."
        },
                {
            label: "📑 Розділ документи",
            text: "Вітаю! У розділі [«Документи»](https://kadroland.com/documents) розміщуються шаблони та зразки документів. Надання відповідей на запитання та надання консультацій у межах цього сервісу не передбачено. Для розробки чи пошуку необхідного шаблону документу зверніться у сервіс  [«Консультант по документах»](https://kadroland.com/consultations/consultations-documents)"
        },
        {
            label: "📑Окі-Докі",
            text: "Вітаю. Не можете знайти необхідний документ? Зверніться до Консультанта по документах у сервісі [«Окі-Докі»](https://kadroland.com/events/500/1210)"
        },
        {
            label: "🔗Вставка посилання",
            text: "[]()"
        }
    ];

    let templates = JSON.parse(localStorage.getItem(STORAGE_KEY))
        || JSON.parse(localStorage.getItem(LEGACY_KEY)) // migrate from old key if present
        || DEFAULT_TEMPLATES;
    let activeEditIndex = 0;

    const saveToDisk = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));

    // Editor modal + injected toolbar styles
    const style = document.createElement('style');
    style.textContent = `
        .kh-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; align-items: center; justify-content: center; font-family: 'Segoe UI', sans-serif; }
        .kh-modal { background: #f9fafb; width: 950px; height: 650px; border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .kh-modal-header { padding: 20px; background: white; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
        .kh-modal-body { display: flex; flex: 1; overflow: hidden; }
        .kh-sidebar { width: 320px; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; background: #fff; }
        .kh-list { flex: 1; overflow-y: auto; padding: 10px; }
        .kh-item { display: flex; align-items: center; padding: 12px; margin-bottom: 8px; background: #f3f4f6; border-radius: 8px; cursor: pointer; border: 2px solid transparent; transition: 0.2s; }
        .kh-item:hover { background: #e5e7eb; }
        .kh-item.active { border-color: #2563eb; background: #eff6ff; }
        .kh-item-name { flex: 1; font-weight: 600; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 5px; }
        .kh-editor-pane { flex: 1; padding: 25px; display: flex; flex-direction: column; gap: 15px; background: white; }
        .kh-label-input { font-size: 18px; font-weight: bold; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; width: 100%; box-sizing: border-box; }
        .kh-text-area { flex: 1; font-size: 16px; padding: 15px; border: 1px solid #d1d5db; border-radius: 8px; line-height: 1.6; resize: none; font-family: inherit; box-sizing: border-box; }
        .kh-modal-footer { padding: 15px 20px; background: #f3f4f6; border-top: 1px solid #e5e7eb; display: flex; gap: 10px; align-items: center; }
        .kh-btn { padding: 10px 18px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 14px; }
        .kh-btn-primary { background: #2563eb; color: white; }
        .kh-btn-success { background: #10b981; color: white; }
        .kh-btn-warn { background: #f59e0b; color: white; }
        .kh-btn-ghost { background: #6b7280; color: white; }
        .kh-info-icon { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; background: #9ca3af; color: white; border-radius: 50%; font-size: 12px; cursor: help; position: relative; }
        .kh-info-icon:hover::after {
            content: "Шаблони зберігаються локально. Якщо ви очистите кеш, вони зникнуть. Рекомендуємо експортувати їх у файл.";
            position: absolute; bottom: 25px; right: 0; width: 250px; background: #1f2937; color: white; padding: 10px; border-radius: 8px; font-size: 12px; line-height: 1.4; z-index: 10000;
        }
        .kh-item-btn { background: none; border: none; cursor: pointer; padding: 5px; font-size: 16px; color: #9ca3af; }
        /* Injected comment-toolbar controls — matched to the site's .k-btn pills (40px, radius 25px, red hover) */
        .kh-gear-btn { width: 40px; height: 40px; margin-right: 12px; border: 1px solid #e3e3e3; border-radius: 50%; background: #f4f4f4; color: #555; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: 0.15s; }
        .kh-gear-btn:hover { background: #ececec; color: #232323; }
        .ai-template-select { height: 40px; width: 220px; padding: 0 38px 0 18px; border: 1px solid #e0e0e0; border-radius: 25px; background-color: #fff; color: #232323; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; appearance: none; outline: none; transition: 0.15s; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 14px center; background-size: 18px; }
        .ai-template-select:hover { border-color: #ed3434; color: #ed3434; }
        .ai-template-select.kh-flash { background-color: #10b981 !important; border-color: #10b981 !important; color: #fff !important; }
    `;
    document.head.appendChild(style);

    const openEditor = () => {
        const overlay = document.createElement('div');
        overlay.className = 'kh-modal-overlay';

        const render = () => {
            overlay.innerHTML = `
                <div class="kh-modal">
                    <div class="kh-modal-header">
                        <h2 style="margin:0; font-size: 20px;">Управління шаблонами</h2>
                        <button class="kh-btn kh-btn-ghost" id="closeEditor">Закрити</button>
                    </div>
                    <div class="kh-modal-body">
                        <div class="kh-sidebar">
                            <div class="kh-list" id="khList"></div>
                            <div style="padding: 10px; border-top: 1px solid #eee;">
                                <button class="kh-btn kh-btn-primary" style="width:100%" id="addTmpl">+ Новий шаблон</button>
                            </div>
                        </div>
                        <div class="kh-editor-pane" id="khEditorPane"></div>
                    </div>
                    <div class="kh-modal-footer">
                        <button class="kh-btn kh-btn-success" id="exportBtn" title="Зберегти як JSON">📥 Експорт</button>
                        <button class="kh-btn kh-btn-success" id="importBtn" title="Завантажити з JSON">📤 Імпорт</button>
                        <button class="kh-btn kh-btn-warn" id="devBtn" title="Для розробника">🛠 Код для JS</button>
                        <input type="file" id="importFile" style="display:none" accept=".json">
                        <div style="flex:1"></div>
                        <span style="font-size:12px; color:#6b7280; display:flex; align-items:center; gap:5px;">
                            Зберігається локально <div class="kh-info-icon">?</div>
                        </span>
                    </div>
                </div>
            `;

            const listContainer = overlay.querySelector('#khList');
            const editorPane = overlay.querySelector('#khEditorPane');

            templates.forEach((tmpl, idx) => {
                const item = document.createElement('div');
                item.className = `kh-item ${idx === activeEditIndex ? 'active' : ''}`;
                item.draggable = true;
                item.innerHTML = `
                    <div class="kh-drag-handle">☰</div>
                    <div class="kh-item-name">${tmpl.label || '(Без назви)'}</div>
                    <button class="kh-item-btn dup" title="Дублювати">📁</button>
                    <button class="kh-item-btn del" title="Видалити">×</button>
                `;

                item.onclick = (e) => {
                    if(e.target.closest('.del')) {
                        templates.splice(idx, 1);
                        activeEditIndex = Math.max(0, idx - 1);
                        saveToDisk(); render(); return;
                    }
                    if(e.target.closest('.dup')) {
                        templates.splice(idx + 1, 0, {...templates[idx], label: templates[idx].label + " (Копія)"});
                        activeEditIndex = idx + 1;
                        saveToDisk(); render(); return;
                    }
                    activeEditIndex = idx;
                    render();
                };

                item.ondragstart = (e) => e.dataTransfer.setData('text', idx);
                item.ondragover = (e) => e.preventDefault();
                item.ondrop = (e) => {
                    const fromIdx = e.dataTransfer.getData('text');
                    const moved = templates.splice(fromIdx, 1)[0];
                    templates.splice(idx, 0, moved);
                    activeEditIndex = idx;
                    saveToDisk(); render();
                };
                listContainer.appendChild(item);
            });

            if (templates[activeEditIndex]) {
                const tmpl = templates[activeEditIndex];
                editorPane.innerHTML = `
                    <input type="text" class="kh-label-input" value="${tmpl.label}" placeholder="Назва">
                    <textarea class="kh-text-area" placeholder="Текст відповіді...">${tmpl.text}</textarea>
                `;
                const lInp = editorPane.querySelector('.kh-label-input');
                const tInp = editorPane.querySelector('.kh-text-area');
                lInp.oninput = () => { templates[activeEditIndex].label = lInp.value; saveToDisk(); updateSidebarNames(); };
                tInp.oninput = () => { templates[activeEditIndex].text = tInp.value; saveToDisk(); };
            }

            // Developer Button
            overlay.querySelector('#devBtn').onclick = () => {
                const confirmed = confirm("Це створить блок коду для програміста. Ви зможете скопіювати його та вставити у DEFAULT_TEMPLATES в самому коді скрипта. Продовжити?");
                if(confirmed) {
                    const code = JSON.stringify(templates, null, 4);
                    const blob = new Blob([code], {type: 'text/plain;charset=utf-8'});
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = 'new_default_code.txt';
                    a.click();
                    alert("Файл 'new_default_code.txt' завантажено. Скопіюйте його вміст у код скрипта.");
                }
            };

            overlay.querySelector('#exportBtn').onclick = () => {
                const data = JSON.stringify(templates, null, 4); // Pretty spacing
                const blob = new Blob([data], {type: 'application/json;charset=utf-8'});
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `kadro_backup_${new Date().toISOString().slice(0,10)}.json`;
                a.click();
            };

            overlay.querySelector('#importBtn').onclick = () => overlay.querySelector('#importFile').click();
            overlay.querySelector('#importFile').onchange = (e) => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const data = JSON.parse(ev.target.result);
                        if(Array.isArray(data)) { templates = data; saveToDisk(); render(); }
                    } catch(err) { alert("Помилка JSON!"); }
                };
                reader.readAsText(e.target.files[0], 'UTF-8');
            };

            overlay.querySelector('#addTmpl').onclick = () => {
                templates.push({ label: "Новий шаблон", text: "" });
                activeEditIndex = templates.length - 1;
                saveToDisk(); render();
            };

            overlay.querySelector('#closeEditor').onclick = () => {
                overlay.remove();
                document.querySelectorAll('.ai-template-select').forEach(s => updateDropdownOptions(s));
            };
        };

        const updateSidebarNames = () => {
            const items = overlay.querySelectorAll('.kh-item-name');
            if(items[activeEditIndex]) items[activeEditIndex].innerText = templates[activeEditIndex].label;
        };

        render();
        document.body.appendChild(overlay);
    };

    const updateDropdownOptions = (select) => {
        select.innerHTML = '<option value="" disabled selected>📋 ШАБЛОН</option>';
        templates.forEach((tmpl, idx) => {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.text = tmpl.label || `Template ${idx+1}`;
            select.appendChild(opt);
        });
    };

    const injectTools = () => {
        document.querySelectorAll('.comment-form').forEach(form => {
            if (form.querySelector('.kh-wrapper')) return;
            const sendBtn = form.querySelector('.comment-form__send-btn');
            const textarea = form.querySelector('textarea');
            if (!sendBtn || !textarea) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'kh-wrapper';
            wrapper.style.cssText = 'display:flex; align-items:center; margin-right:12px;';

            const gearBtn = document.createElement('button');
            gearBtn.className = 'kh-gear-btn';
            gearBtn.title = 'Керування шаблонами';
            gearBtn.textContent = '⚙︎'; // text-style gear (takes button color)
            gearBtn.onclick = (e) => { e.preventDefault(); openEditor(); };

            const select = document.createElement('select');
            select.className = 'ai-template-select';
            updateDropdownOptions(select);

            select.onchange = () => {
                if (select.value === "") return;
                const tmpl = templates[select.value];
                const current = textarea.value;
                const newValue = current + (current ? "\n\n" : "") + tmpl.text;
                textarea.value = newValue;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                if (textarea._vmodel) textarea._vmodel.value = newValue;
                select.value = "";
                select.classList.add('kh-flash');                       // brief green success flash
                setTimeout(() => select.classList.remove('kh-flash'), 450);
            };

            wrapper.appendChild(gearBtn);
            wrapper.appendChild(select);
            sendBtn.parentElement.insertBefore(wrapper, sendBtn);
        });
    };

    setInterval(injectTools, 1000);
})();