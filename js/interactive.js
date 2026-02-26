const toggleHistoryBtn = document.getElementById('toggle-history-btn');
const historyList = document.getElementById('history-list');

if (toggleHistoryBtn && historyList) {
    toggleHistoryBtn.addEventListener('click', function() {
        if (historyList.style.display === 'none') {
            historyList.style.display = 'flex'; // Показуємо
            toggleHistoryBtn.textContent = 'Приховати історію';
        } else {
            historyList.style.display = 'none'; // Ховаємо
            toggleHistoryBtn.textContent = 'Показати історію';
        }
    });
}

const commandButtons = document.querySelectorAll('.action-menu .action-btn');

// Змінні для Гіперстрибка (поки тестові)
let isMissionSelected = false; 
const jumpCostEnergy = 20; // 20%
const jumpCostFuel = 30;   // 30%

// Використовуємо цикл for для прив'язки подій до кожної кнопки
for (let i = 0; i < commandButtons.length; i++) {
    let btn = commandButtons[i];
    let originalText = btn.textContent; 

    btn.addEventListener('mouseenter', function() {
        btn.style.borderColor = '#FFC107'; 
        
        // Логіка if-else для зміни тексту при наведенні
        if (originalText === 'Почати місію') {
            btn.innerHTML = `${originalText} <br><span style="font-size: 12px; color: #FFC107;">Витрати: -${jumpCostEnergy}% Енергії, -${jumpCostFuel}% Пального</span>`;
        } else if (originalText === 'Ремонт систем') {
            btn.innerHTML = `${originalText} <br><span style="font-size: 12px; color: #FFC107;">Відновить 2-5% ОЗ</span>`;
        }
    });

    btn.addEventListener('mouseleave', function() {
        btn.style.borderColor = 'rgb(69, 193, 235)'; // Повертаємо стандартний колір
        btn.innerHTML = originalText; // Повертаємо оригінальний текст
    });

    btn.addEventListener('click', function() {
        
        if (originalText === 'Ремонт систем') {
            // Знаходимо блок зі здоров'ям (перший елемент списку)
            let hpElement = document.querySelector('nav ul li:first-child .stat-value');
            if (hpElement) {
                let currentHP = parseInt(hpElement.textContent);
                    if (currentHP >= 10000) {
                        alert("Системи в ідеальному стані! Ремонт не потрібен.");
                        return;
                    }
                let randomPercent = Math.floor(Math.random() * (5 - 2 + 1)) + 2; 
                let hpBonus = Math.floor(currentHP * (randomPercent / 100));
                let newHP = currentHP + hpBonus;
                let actualBonus = hpBonus;
                if (newHP > 10000) {
                    actualBonus = 10000 - currentHP; 
                    newHP = 10000;
                }
                hpElement.textContent = newHP + ' ОЗ';
                // Оновлюємо смужки (викликаємо функцію з status.js)
                if (typeof updateStatuses === 'function') {
                    updateStatuses();
                    // Зберігаємо змінене здоров'я в пам'ять
                if (typeof saveStats === 'function') saveStats();
                }
                if (newHP === 10000) {
                    alert(`Ремонт успішний! Відновлено ${actualBonus} ОЗ. Системи повністю відновлено до максимуму!`);
                } else {
                    alert(`Ремонт успішний! Відновлено ${actualBonus} ОЗ (${randomPercent}%).`);
                }
            }
        }
        else if (originalText === 'Почати місію') {
            if (!isMissionSelected) {
                alert("Помилка навігації! Спочатку оберіть Експедицію та Місію.");
                return; 
            }
            let energyElement = document.querySelector('nav ul li:nth-child(2) .stat-value');
            let fuelElement = document.querySelector('nav ul li:nth-child(4) .stat-value');
            if (energyElement && fuelElement) {
                let currentEnergy = parseInt(energyElement.textContent);
                let currentFuel = parseInt(fuelElement.textContent);
                if (currentEnergy < jumpCostEnergy || currentFuel < jumpCostFuel) {
                    alert("Критична помилка! Недостатньо ресурсів для місії.");
                    return;
                }
                energyElement.textContent = (currentEnergy - jumpCostEnergy) + '%';
                fuelElement.textContent = (currentFuel - jumpCostFuel) + '%';
                if (typeof updateStatuses === 'function') updateStatuses();
                if (typeof saveStats === 'function') saveStats();
                let timerDisplay = document.getElementById('mission-timer-display');
                let timeLeftSpan = document.getElementById('time-left');
                let flightTime = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
                btn.textContent = 'Місія в процесі...';
                timerDisplay.style.display = 'block';
                timeLeftSpan.textContent = flightTime;
                let countdown = setInterval(function() {
                    flightTime--;
                    timeLeftSpan.textContent = flightTime;
                    if (flightTime <= 0) {  // КОЛИ ЧАС ВИЙШОВ:
                        clearInterval(countdown); // Зупиняємо таймер
                        btn.disabled = false; // Повертаємо кнопку в нормальний стан
                        btn.style.opacity = '1';
                        btn.style.cursor = 'pointer';
                        btn.textContent = originalText;
                        timerDisplay.style.display = 'none'; // Ховаємо таймер
                        let selectedExp = document.getElementById('expedition-select').value;
                        let selectedMis = document.getElementById('mission-select').value;
                        let isMissionSuccess = Math.random() > 0.3; 
                        let missionStatusText = isMissionSuccess ? "Успішно виконано" : "Провалено (Аварія)";
                        let missionRewardsText = "";
                        if (isMissionSuccess) {
                            missionRewardsText = "+1000 Ресурсів, +10% Енергії";
                            let curEnergy = parseInt(energyElement.textContent);
                            energyElement.textContent = Math.min(100, curEnergy + 10) + '%';
                        } else {
                            missionRewardsText = "-1500 ОЗ";
                            let hpElement = document.querySelector('nav ul li:first-child .stat-value');
                            let curHP = parseInt(hpElement.textContent);
                            hpElement.textContent = Math.max(0, curHP - 1500) + ' ОЗ';
                        }
                        if (typeof updateStatuses === 'function') updateStatuses();
                        if (typeof saveStats === 'function') saveStats();
                        if (typeof addHistoryEntry === 'function') {
                            addHistoryEntry(`${selectedExp}: ${selectedMis}`, missionStatusText, missionRewardsText, isMissionSuccess);
                        }
                        isMissionSelected = false;
                        document.getElementById('mission-select').selectedIndex = 0;
                        document.getElementById('mission-select').disabled = true;

                        alert("Місію завершено! Результати додано у бортовий журнал.");
                    }
                }, 1000);
            }
        }
    });
}

// ==========================================
// СИСТЕМА ЕКСПЕДИЦІЙ ТА МІСІЙ (Спадні списки)
// ==========================================

const expSelect = document.getElementById('expedition-select');
const misSelect = document.getElementById('mission-select');

// Масиви з усіма можливими варіантами
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