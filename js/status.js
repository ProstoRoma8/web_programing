// Ключ для збереження статусів у пам'яті
const STATS_KEY = 'cosmic_expeditions_stats';

// Дефолтні значення (якщо гравець зайшов вперше або очистив збереження)
const defaultStats = {
    hp: 8500,
    energy: 50,
    shields: 85,
    fuel: 85
};

// 1. Функція завантаження статусів із пам'яті в HTML
function loadStats() {
    let savedStats = localStorage.getItem(STATS_KEY);
    let stats = savedStats ? JSON.parse(savedStats) : defaultStats;

    // Знаходимо елементи і записуємо в них збережені значення
    let hpElement = document.querySelector('nav ul li:nth-child(1) .stat-value');
    let energyElement = document.querySelector('nav ul li:nth-child(2) .stat-value');
    let shieldsElement = document.querySelector('nav ul li:nth-child(3) .stat-value');
    let fuelElement = document.querySelector('nav ul li:nth-child(4) .stat-value');

    if (hpElement && energyElement && shieldsElement && fuelElement) {
        hpElement.textContent = stats.hp + ' ОЗ';
        energyElement.textContent = stats.energy + '%';
        shieldsElement.textContent = stats.shields + '%';
        fuelElement.textContent = stats.fuel + '%';
    }
}

// 2. Функція збереження ПОТОЧНИХ статусів у пам'ять
function saveStats() {
    let hpElement = document.querySelector('nav ul li:nth-child(1) .stat-value');
    let energyElement = document.querySelector('nav ul li:nth-child(2) .stat-value');
    let shieldsElement = document.querySelector('nav ul li:nth-child(3) .stat-value');
    let fuelElement = document.querySelector('nav ul li:nth-child(4) .stat-value');

    if (hpElement && energyElement && shieldsElement && fuelElement) {
        let currentStats = {
            hp: parseInt(hpElement.textContent),
            energy: parseInt(energyElement.textContent),
            shields: parseInt(shieldsElement.textContent),
            fuel: parseInt(fuelElement.textContent)
        };
        localStorage.setItem(STATS_KEY, JSON.stringify(currentStats));
    }
}

// 3. Основна функція оновлення смужок (та, що вже була у нас)
function updateStatuses() {
    const statItems = document.querySelectorAll('nav ul li');

    for (let i = 0; i < statItems.length; i++) {
        let currentItem = statItems[i];
        let fillBar = currentItem.querySelector('.fill');
        let valueText = currentItem.querySelector('.stat-value');

        if (fillBar && valueText) {
            let rawText = valueText.textContent.trim(); 
            let numericValue = parseInt(rawText);
            let percentage = 0;

            if (rawText.includes('ОЗ')) {
                let maxHP = 10000; 
                percentage = (numericValue / maxHP) * 100;
            } else {
                percentage = numericValue;
            }

            if (percentage > 100) percentage = 100;
            if (percentage < 0) percentage = 0;

            fillBar.style.width = percentage + '%';

            if (percentage >= 70) {
                fillBar.style.backgroundColor = '#4CAF50'; 
                fillBar.style.boxShadow = 'none';
            } else if (percentage >= 30 && percentage < 70) {
                fillBar.style.backgroundColor = '#FFC107'; 
                fillBar.style.boxShadow = 'none';
            } else {
                fillBar.style.backgroundColor = '#F44336'; 
                fillBar.style.boxShadow = '0 0 10px #F44336'; 
                
                if (!rawText.includes('⚠️')) {
                    valueText.innerHTML = rawText + ' ⚠️';
                }
                valueText.style.color = '#F44336';
                valueText.style.fontWeight = 'bold';
            }
        }
    }
}

// ПРИ ЗАВАНТАЖЕННІ: спочатку вантажимо цифри, потім малюємо смужки
loadStats();
updateStatuses();