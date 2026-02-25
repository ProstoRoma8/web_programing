// ==========================================
// ЗАВДАННЯ 2. Кроки 1-2: Перемикач видимості (Toggle) з if-else
// ==========================================
const toggleHistoryBtn = document.getElementById('toggle-history-btn');
const historyList = document.getElementById('history-list');

if (toggleHistoryBtn && historyList) {
    toggleHistoryBtn.addEventListener('click', function() {
        // Перевіряємо поточний стан (if-else)
        if (historyList.style.display === 'none') {
            historyList.style.display = 'flex'; // Показуємо
            toggleHistoryBtn.textContent = 'Приховати історію';
        } else {
            historyList.style.display = 'none'; // Ховаємо
            toggleHistoryBtn.textContent = 'Показати історію';
        }
    });
}

// ==========================================
// ЗАВДАННЯ 2. Кроки 3-4: Цикли та події наведення/кліку
// ==========================================
// Вибираємо всі кнопки тільки в Командному центрі
const commandButtons = document.querySelectorAll('.action-menu .action-btn');

// Змінні для Гіперстрибка (поки тестові)
let isMissionSelected = false; 
const jumpCostEnergy = 20; // 20%
const jumpCostFuel = 30;   // 30%

// Використовуємо цикл for для прив'язки подій до кожної кнопки
for (let i = 0; i < commandButtons.length; i++) {
    let btn = commandButtons[i];
    let originalText = btn.textContent; // Запам'ятовуємо оригінальний текст кнопки

    // --- ПОДІЯ: Наведення миші (Hover) ---
    btn.addEventListener('mouseenter', function() {
        btn.style.borderColor = '#FFC107'; // Робимо рамку жовтою
        
        // Логіка if-else для зміни тексту при наведенні
        if (originalText === 'Гіперстрибок') {
            btn.innerHTML = `${originalText} <br><span style="font-size: 12px; color: #FFC107;">Витрати: -${jumpCostEnergy}% Енергії, -${jumpCostFuel}% Пального</span>`;
        } else if (originalText === 'Ремонт систем') {
            btn.innerHTML = `${originalText} <br><span style="font-size: 12px; color: #FFC107;">Відновить 2-5% ОЗ</span>`;
        }
    });

    // --- ПОДІЯ: Відведення миші ---
    btn.addEventListener('mouseleave', function() {
        btn.style.borderColor = 'rgb(69, 193, 235)'; // Повертаємо стандартний колір
        btn.innerHTML = originalText; // Повертаємо оригінальний текст
    });


    // --- ПОДІЯ: Клік по кнопці ремонту ---
    btn.addEventListener('click', function() {
        
        if (originalText === 'Ремонт систем') {
            // Знаходимо блок зі здоров'ям (перший елемент списку)
            let hpElement = document.querySelector('nav ul li:first-child .stat-value');
            if (hpElement) {
                let currentHP = parseInt(hpElement.textContent);

                // 1. ПЕРЕВІРКА: Якщо здоров'я ВЖЕ максимальне - зупиняємо ремонт
                if (currentHP >= 10000) {
                    alert("Системи в ідеальному стані! Ремонт не потрібен.");
                    return; // Команда return зупиняє виконання коду нижче
                }

                // Випадкове число від 2 до 5
                let randomPercent = Math.floor(Math.random() * (5 - 2 + 1)) + 2; 
                
                // Рахуємо ТЕОРЕТИЧНИЙ бонус
                let hpBonus = Math.floor(currentHP * (randomPercent / 100));
                let newHP = currentHP + hpBonus;
                
                // Змінна для РЕАЛЬНОГО бонусу (скільки насправді додалося)
                let actualBonus = hpBonus;

                // 2. ОБМЕЖЕННЯ: Якщо перевалили за 10000
                if (newHP > 10000) {
                    // Вираховуємо, скільки ОЗ реально влізло до повної шкали
                    actualBonus = 10000 - currentHP; 
                    newHP = 10000;
                }
                
                // Оновлюємо текст в HTML
                hpElement.textContent = newHP + ' ОЗ';
                
                // Оновлюємо смужки (викликаємо функцію з status.js)
                if (typeof updateStatuses === 'function') {
                    updateStatuses();
                    // Зберігаємо змінене здоров'я в пам'ять
                if (typeof saveStats === 'function') saveStats();
                }
                
                // 3. ФІДБЕК: Показуємо правильні повідомлення
                if (newHP === 10000) {
                    // Якщо після ремонту здоров'я стало рівно 10000
                    alert(`Ремонт успішний! Відновлено ${actualBonus} ОЗ. Системи повністю відновлено до максимуму!`);
                } else {
                    // Звичайний ремонт
                    alert(`Ремонт успішний! Відновлено ${actualBonus} ОЗ (${randomPercent}%).`);
                }
            }
        }
        
        else if (originalText === 'Гіперстрибок') {
            // 1. Спочатку перевіряємо, чи взагалі прокладено маршрут
            if (!isMissionSelected) {
                alert("Помилка навігації! Спочатку оберіть Експедицію та Місію.");
                return; // Зупиняємо код, далі не йдемо
            }
            // 2. Використовуємо правильні селектори nth-child()
            let energyElement = document.querySelector('nav ul li:nth-child(2) .stat-value');
            let fuelElement = document.querySelector('nav ul li:nth-child(4) .stat-value');

            if (energyElement && fuelElement) {
                // Витягуємо чисті числа (наприклад, 85 і 50)
                let currentEnergy = parseInt(energyElement.textContent);
                let currentFuel = parseInt(fuelElement.textContent);

                // 3. Перевіряємо, чи вистачає ресурсів на стрибок 
                // (jumpCostEnergy = 20, jumpCostFuel = 30 - ці змінні ми оголосили раніше)
                if (currentEnergy < jumpCostEnergy) {
                    alert("Критична помилка! Недостатньо енергії для стрибка.");
                    return; // Зупиняємо стрибок
                }
                
                if (currentFuel < jumpCostFuel) {
                    alert("Критична помилка! Недостатньо пального для стрибка.");
                    return; // Зупиняємо стрибок
                }

                // 4. Якщо перевірки пройдені - віднімаємо ресурси
                let newEnergy = currentEnergy - jumpCostEnergy;
                let newFuel = currentFuel - jumpCostFuel;

                // Записуємо нові значення назад в HTML (додаємо знак %)
                energyElement.textContent = newEnergy + '%';
                fuelElement.textContent = newFuel + '%';

                // Оновлюємо смужки (викликаємо функцію з status.js)
                // Вони автоматично пожовтіють чи почервоніють, якщо ресурсів стало мало!
                if (typeof updateStatuses === 'function') {
                    updateStatuses();
                    // Зберігаємо зменшені показники після стрибка
                if (typeof saveStats === 'function') saveStats();
                }

                alert(`Гіперстрибок ініційовано! Витрачено: Енергія -${jumpCostEnergy}%, Пальне -${jumpCostFuel}%.`);
                
                // --- ГЕНЕРАЦІЯ РЕЗУЛЬТАТУ МІСІЇ ---
                let selectedExp = document.getElementById('expedition-select').value;
                let selectedMis = document.getElementById('mission-select').value;
                
                let isMissionSuccess = Math.random() > 0.3; 
                let missionStatusText = isMissionSuccess ? "Успішно виконано" : "Провалено (Аварія)";
                let missionRewardsText = "";

                // ВПЛИВ НА КОРАБЕЛЬ:
                if (isMissionSuccess) {
                    missionRewardsText = "+1000 Ресурсів, +10% Енергії";
                    // Додаємо енергію як нагороду
                    let currentEnergy = parseInt(energyElement.textContent);
                    energyElement.textContent = Math.min(100, currentEnergy + 10) + '%';
                } else {
                    missionRewardsText = "-1500 ОЗ";
                    // Віднімаємо здоров'я через аварію
                    let hpElement = document.querySelector('nav ul li:first-child .stat-value');
                    let currentHP = parseInt(hpElement.textContent);
                    hpElement.textContent = Math.max(0, currentHP - 1500) + ' ОЗ';
                }

                // Оновлюємо смужки та ЗБЕРІГАЄМО новий стан
                if (typeof updateStatuses === 'function') updateStatuses();
                if (typeof saveStats === 'function') saveStats();

                // Викликаємо функцію з history.js
                if (typeof addHistoryEntry === 'function') {
                    addHistoryEntry(`${selectedExp}: ${selectedMis}`, missionStatusText, missionRewardsText, isMissionSuccess);
                }
                
                isMissionSelected = false;
                document.getElementById('mission-select').selectedIndex = 0;
            }
        }
    });
}

// ==========================================
// СИСТЕМА ЕКСПЕДИЦІЙ ТА МІСІЙ (Спадні списки)
// ==========================================

const expSelect = document.getElementById('expedition-select');
const misSelect = document.getElementById('mission-select');

// 1. Наші "бази даних" (Масиви з усіма можливими варіантами)
const expeditionsPool = [
    "Сектор Альфа", "Туманність Андромеди", "Система Центавра", 
    "Пояс Оріона", "Квазар X-12", "Закинута Станція 'Ехо'", 
    "Кільця Сатурна", "Чорна Діра 'Левіафан'"
];

const missionsPool = [
    "Розвідка аномалії", "Добування рідкісних кристалів", 
    "Пошук стародавніх артефактів", "Супровід торгового судна", 
    "Зачистка сектору від піратів", "Ремонт зламаного супутника",
    "Дослідження невідомого сигналу", "Порятунок екіпажу"
];

// 2. Функція для вибору випадкових елементів з масиву
// Вона перемішує масив і повертає задану кількість (num) елементів
function getRandomItems(array, num) {
    let shuffled = array.slice(); // Робимо копію масиву
    for (let i = shuffled.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // Випадковий індекс
        // Міняємо місцями елементи
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, num); // Повертаємо перші `num` елементів
}

// 3. Функція заповнення списку експедицій при завантаженні гри
function initExpeditions() {
    if (!expSelect) return; // Перевірка, чи існує елемент на сторінці
    
    // Очищаємо список, залишаючи лише перший неактивний пункт
    expSelect.innerHTML = '<option value="" disabled selected>Вибір експедиції</option>';
    
    // Отримуємо 3 випадкові експедиції
    let randomExpeditions = getRandomItems(expeditionsPool, 3);
    
    // Використовуємо цикл для створення тегів <option>
    for(let i = 0; i < randomExpeditions.length; i++) {
        let option = document.createElement('option');
        option.value = randomExpeditions[i];
        option.textContent = randomExpeditions[i];
        expSelect.appendChild(option);
    }
}

// Запускаємо заповнення експедицій одразу
initExpeditions();

// 4. Обробка події "change" (коли гравець вибрав експедицію)
if (expSelect && misSelect) {
    expSelect.addEventListener('change', function() {
        // Розблоковуємо список місій
        misSelect.disabled = false;
        
        // Очищаємо попередні місії (якщо гравець вирішив змінити експедицію)
        misSelect.innerHTML = '<option value="" disabled selected>Вибір місії</option>';
        
        // Отримуємо 3 випадкові місії
        let randomMissions = getRandomItems(missionsPool, 3);
        
        for(let i = 0; i < randomMissions.length; i++) {
            let option = document.createElement('option');
            option.value = randomMissions[i];
            option.textContent = randomMissions[i];
            misSelect.appendChild(option);
        }
        
        // Скидаємо готовність до стрибка (бо експедицію обрано, а місію ще ні)
        isMissionSelected = false; // Ця змінна у нас вже є в коді кнопок!
    });

    // 5. Обробка вибору місії
    misSelect.addEventListener('change', function() {
        // Коли обрано і експедицію, і місію - дозволяємо Гіперстрибок
        isMissionSelected = true;
        console.log(`Обрано: ${expSelect.value} -> ${misSelect.value}`);
        // Тут можна вивести гарний alert, або просто дозволити грати далі
    });
}