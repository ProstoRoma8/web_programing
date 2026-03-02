// ==========================================
// СИСТЕМА ІСТОРІЇ (localStorage)
// ==========================================

// Ключ, за яким ми будемо зберігати дані в пам'яті браузера
const HISTORY_KEY = 'cosmic_expeditions_history';

// 1. Функція для завантаження історії
function loadHistory() {
    // Пробуємо дістати дані з пам'яті
    let savedData = localStorage.getItem(HISTORY_KEY);
    
    if (savedData) {
        // Якщо дані є, розпаковуємо їх з тексту назад у масив JavaScript
        return JSON.parse(savedData);
    } else {
        // Якщо гравець зайшов вперше (даних немає), повертаємо базовий масив
        return [
            {
                sector: "Сектор 7: Розвідка",
                status: "Успіх",
                rewards: "+500 Ресурсів",
                isSuccess: true
            },
            {
                sector: "Сектор 12: Астероїдне поле",
                status: "Критичне пошкодження",
                rewards: "-1500 ОЗ",
                isSuccess: false
            }
        ];
    }
}

// 2. Функція для збереження історії
function saveHistory(historyArray) {
    // Перетворюємо масив у текст (JSON) і записуємо в пам'ять браузера
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historyArray));
}

// 3. Функція для відображення історії на екрані
function renderHistory() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;

    // Очищаємо поточний список в HTML
    historyList.innerHTML = '';
    
    // Завантажуємо актуальну історію
    const historyArray = loadHistory();

    // Перебираємо масив і створюємо HTML-елементи для кожного запису
    for (let i = 0; i < historyArray.length; i++) {
        let entry = historyArray[i];
        
        let itemDiv = document.createElement('div');
        // Залежно від успіху додаємо клас success (зелений) або failure (червоний)
        itemDiv.className = `history-item ${entry.isSuccess ? 'success' : 'failure'}`;
        
        // Заповнюємо HTML структуру (таку ж, як ти робив у своєму index.html)
        itemDiv.innerHTML = `
            <div class="history-info">
                <strong>${entry.sector}</strong>
                <span>Статус: ${entry.status}</span>
            </div>
            <div class="history-rewards">
                <span>${entry.rewards}</span>
            </div>
        `;
        
        historyList.appendChild(itemDiv);
    }
}

// 4. Функція для ДОДАВАННЯ нового запису (буде викликатись після Гіперстрибка)
function addHistoryEntry(sectorName, missionStatus, rewardsText, isSuccess) {
    let historyArray = loadHistory();
    
    // Створюємо новий об'єкт історії
    let newEntry = {
        sector: sectorName,
        status: missionStatus,
        rewards: rewardsText,
        isSuccess: isSuccess
    };
    
    // .unshift() додає новий елемент НА ПОЧАТОК масиву (щоб найновіші були зверху!)
    historyArray.unshift(newEntry);
    
    // (Опціонально) Щоб пам'ять не переповнювалась, зберігаємо тільки останні 30 записів
    if (historyArray.length > 30) {
        historyArray.pop(); // Видаляємо найстаріший (останній) запис
    }

    // Зберігаємо оновлений масив і перемальовуємо екран
    saveHistory(historyArray);
    renderHistory();
}

// Викликаємо рендер одразу при завантаженні сторінки
renderHistory();

// ==========================================
// ОЧИЩЕННЯ ІСТОРІЇ
// ==========================================

const clearHistoryBtn = document.getElementById('clear-history-btn');

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', function() {
        // Викликаємо вбудоване вікно підтвердження браузера
        let isSure = confirm("Командире, ви впевнені, що хочете безповоротно стерти бортовий журнал?");
        
        // Якщо гравець натиснув "ОК" (true)
        if (isSure) {
            // 1. Очищаємо історію та статуси систем (те, що вже було)
            localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
            localStorage.removeItem('cosmic_expeditions_stats'); 
            
            // 2. НОВЕ: Видаляємо дані корабля з пам'яті
            localStorage.removeItem('cosmic_ship_name');
            localStorage.removeItem('cosmic_ship_image');
            
            // 3. НОВЕ: Скидаємо візуальний інтерфейс корабля
            let nameInput = document.getElementById('ship-name-input');
            let imgPreview = document.getElementById('ship-img-preview');
            let textPlaceholder = document.getElementById('ship-image-text');
            
            if (nameInput) nameInput.value = "Зоряний Мандрівник"; // Дефолтна назва
            if (imgPreview) {
                imgPreview.style.display = 'none'; // Ховаємо картинку
                imgPreview.src = '';               // Очищаємо джерело
            }
            if (textPlaceholder) textPlaceholder.style.display = 'block'; // Повертаємо сірий квадрат
            
            // 4. Відновлюємо інтерфейс решти гри
            renderHistory();
            if (typeof loadStats === 'function') loadStats();
            if (typeof updateStatuses === 'function') updateStatuses();
            
            alert("Систему повністю скинуто! Бортовий журнал очищено, корабель повернуто до заводського стану.");
        }
    });
}