// ==UserScript==
// @name         Kadroland Helper: Wide Blue Button White Menu
// @namespace    https://kadroland.com/
// @version      4.1
// @description  Синя кнопка, біле меню, збільшений шрифт та ширина — шаблони відповідей у коментарях
// @author       Fixed & Styled
// @match        https://kadroland.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/RTantrumR/Kadro/main/kadro-comment-templates.user.js
// @downloadURL  https://raw.githubusercontent.com/RTantrumR/Kadro/main/kadro-comment-templates.user.js
// ==/UserScript==

(function() {
    'use strict';

    // ПОВНИЙ ПЕРЕЛІК ШАБЛОНІВ З ТАБЛИЦІ
    const TEMPLATES = [
        {
            label: "💙🧡 Після короткої відповіді",
            text: "💙 Долучайтеся до наших безкоштовних вебінарів або ставайте нашим передплатником в пакеті [«Професіонал»](https://kadroland.com/subscribe). Це дасть можливість без обмежень ставити запитання нашим експертам і отримувати відповіді від 15 хвилин. А вебінари та курси, що входять до пакета, допоможуть завжди бути в курсі всіх актуальних змін.💙"
        },
        {
            label: "🤖 AI (Під сторінкою АІ)",
            text: "Добрий день! Запитання потрібно ставити нашому АІ-консультанту (скріпка з оченятами у правому нижньому куті), або через кнопку ПОСТАВИТИ ЗАПИТАННЯ ☝️ на малюку зверху."
        },
        {
            label: "🤖 AI (Під рекламною статтею АІ)",
            text: "Добрий день, пані...! Запитання потрібно ставити нашому АІ-консультанту (скріпка з оченятами у правому нижньому куті), або через кнопку ПОСТАВИТИ ЗАПИТАННЯ ☝ на малюку зверху. Також ви можете звернутись до спеціалістів з сервісу [Особистий консультант](https://kadroland.com/events/259/683) або замовити [Індивідуальну консультацію](https://kadroland.com/online-konsultaciya) у наших провідних спеціалістів. Сервіс працює цілодобово, 24/7, а відповіді надаються від 15 хвилин!"
        },
        {
            label: "🤖 Хороше запитання – задайте його АІ",
            text: "Дуже хороше запитання - дякуємо, що задали його! До речі, наш [AI-Консультант 🤖](https://kadroland.com/aikonsultant) уже вміє детально пояснювати саме такі ситуації 😉 Ви можете поставити йому запитання у довільній формі, і він дасть точну відповідь за кілька секунд."
        },
        {
            label: "🤖 Власна думка AI",
            text: "Наш [AI-Консультант 🤖](https://kadroland.com/aikonsultant) вже має на це власну думку 😊 Він щодня вивчає оновлення у нормах і дає поради на основі актуальних документів. Спробуйте - можливо, це саме те рішення, яке ви шукаєте!"
        },
        {
            label: "📚 Без запитання (Запрошення на вебінари)",
            text: "💙 Дякуємо, що поділилися! Запрошуємо вас долучитися до наших безкоштовних [вебінарів](https://kadroland.com/free-webinars). Корисні знання та актуальна інформація вже чекають на вас! 💙"
        },
        {
            label: "✍️ Діляться кейсом",
            text: "🧡 Дякуємо, що ділитеся своїм досвідом — для нас та наших читачів це справді важливо! 😊 Долучайтеся до наших безкоштовних вебінарів або ставайте нашим передплатником в пакеті «Професіонал» (https://kadroland.com/subscribe). Це дасть можливість без обмежень ставити запитання нашим експертам і отримувати відповіді від 15 хвилин. А вебінари та курси, що входять до пакета, допоможуть завжди бути в курсі всіх актуальних змін."
        },
        {
            label: "❤️ Дякують 1(Сервіс ОК + Швидкість AI)",
            text: "Щиро дякуємо, що ви з нами! Ваша довіра та підтримка надихають нас щодня. 💙 Наші експерти щодня відповідають на ваші запитання у Сервісі «Особистий консультант» 💬 Вебінари, курси та новини допомагають бути в курсі всіх змін. А тепер ще швидше — [AI-Консультант 🤖](https://kadroland.com/aikonsultant) kadroland!. Передплачуйте «Професіонал» зі [знижкою](https://kadroland.com/subscribe)"
        },
        {
            label: "❤️ Дякують 2 (Підписка на професіонал)",
            text: "Дякуємо Вам за приділений час! 💙 Консультації від експертів, вебінари, курси й новини — усе для кадровиків на kadroland.com. А тепер ще й [AI-Консультант 🤖](https://kadroland.com/aikonsultant). Натисніть на посилання та отримайте миттєву відповідь. Передплачуйте «Професіонал» зі [знижкою](https://kadroland.com/subscribe)"
        },
        {
            label: "❤️ Дякують 3 (Експерти поруч)",
            text: "Дякуємо Вам за теплі слова! ❤️ Ваші експерти завжди поруч 🤝 Консультації, вебінари, курси — і тепер новинка [AI-Консультант 🤖](https://kadroland.com/aikonsultant) kadroland. Натисніть на посилання та отримайте миттєву відповідь. Передплачуйте «Професіонал» зі [знижкою](https://kadroland.com/subscribe)"
        },
        {
            label: "💪 Складне запитання 1 (ОК)",
            text: "Добрий день! Дякуємо за запитання. Ваша ситуація потребує більш повноцінної консультації. Радимо звернутись до спеціалістів з сервісу [«Особистий консультант»](https://kadroland.com/events/259/683) або замовити [Індивідуальну консультацію](https://kadroland.com/online-konsultaciya) у наших провідних спеціалістів. Сервіс працює цілодобово, 24/7, а відповіді надаються вже від 15 хвилин! Також можете спробувати поставити ваше запитання нашому [AI-Консультанту 🤖](https://kadroland.com/aikonsultant). Гарного дня і приємного навчання! 📝"
        },
        {
            label: "💪 Складне запитання 2 (підписка)",
            text: "Для отримання кваліфікованої відповіді рекомендуємо передплатити доступ до нашої платформи в пакеті [«Професіонал»](https://kadroland.com/subscribe). Це дасть можливість без обмежень ставити запитання нашим експертам і отримувати відповіді від 15 хвилин. А вебінари та курси, що входять до пакету, допоможуть завжди бути в курсі всіх актуальних змін. Також можете спробувати поставити ваше запитання нашому [AI-Консультанту 🤖](https://kadroland.com/aikonsultant)."
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
            label: "🙈 Питання не за адресою",
            text: "Вітаю! У розділі [«Документи»](https://kadroland.com/documents) розміщуються шаблони та зразки документів. Надання відповідей на запитання та надання консультацій у межах цього сервісу не передбачено. Для розробки чи пошуку необхідного шаблону документу зверніться у сервіс  [«Консультант по документах»](https://kadroland.com/consultations/consultations-documents)"
        }
    ];

    const injectDropdown = () => {
        const commentForms = document.querySelectorAll('.comment-form');
commentForms.forEach(form => {
            if (form.querySelector('.ai-template-select')) return;

            const sendBtn = form.querySelector('.comment-form__send-btn');
            const textarea = form.querySelector('textarea');
            if (!sendBtn || !textarea) return;

            // Контейнер для вирівнювання (Flexbox)
            const parent = sendBtn.parentElement;
            parent.style.display = 'flex';
            parent.style.alignItems = 'center';
            parent.style.justifyContent = 'flex-end';

            const select = document.createElement('select');
            select.className = 'ai-template-select';

            // ОНОВЛЕНІ СТИЛІ: Ширина, шрифт, кольори
            select.style.cssText = `
                background-color: #2563eb;
                color: white;
                border: 2px solid #1d4ed8;
                padding: 0 40px 0 20px;
                border-radius: 24px;
                margin-right: 15px;
                cursor: pointer;
                font-size: 15px; /* Збільшений шрифт */
                font-weight: 600;
                height: 44px; /* Трохи вища кнопка */
                width: 360px; /* Збільшена вдвічі ширина */
                font-family: inherit;
                outline: none;
                vertical-align: middle;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: all 0.2s ease;
                appearance: none;
                background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
                background-repeat: no-repeat;
                background-position: right 15px center;
                background-size: 24px;
            `;

            // Дефолтний пункт
            const defaultOption = document.createElement('option');
            defaultOption.text = "📋 ОБЕРІТЬ ШАБЛОН ВІДПОВІДІ";
            defaultOption.value = "";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            // Стиль самого списку (білий фон, чорний текст)
            defaultOption.style.backgroundColor = "white";
            defaultOption.style.color = "#9ca3af";
            select.appendChild(defaultOption);

            // Додавання опцій
            TEMPLATES.forEach((tmpl, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.text = tmpl.label;

                // СТИЛІЗАЦІЯ ПУНКТІВ МЕНЮ (Білий фон)
                option.style.backgroundColor = "white";
                option.style.color = "black";
                option.style.padding = "10px";
                select.appendChild(option);
            });

            select.onchange = () => {
                if (select.value === "") return;
                const text = TEMPLATES[select.value].text;

                textarea.value = text;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));

                if (textarea._vmodel) textarea._vmodel.value = text;
                textarea.focus();

                select.value = ""; // Скидання

                // Анімація успіху
                select.style.backgroundColor = '#10b981';
                setTimeout(() => { select.style.backgroundColor = '#2563eb'; }, 500);
            };

            sendBtn.parentElement.insertBefore(select, sendBtn);
        });
    };

    injectDropdown();
    setInterval(injectDropdown, 1000);
    const observer = new MutationObserver(() => injectDropdown());
    observer.observe(document.body, { childList: true, subtree: true });

})();