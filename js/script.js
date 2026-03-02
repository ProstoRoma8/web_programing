// ==========================================
// НАЛАШТУВАННЯ КОРАБЛЯ (Назва та Зображення)
// ==========================================
const shipNameInput = document.getElementById('ship-name-input');
const shipImageContainer = document.getElementById('ship-image-container');
const shipImageUpload = document.getElementById('ship-image-upload');
const shipImgPreview = document.getElementById('ship-img-preview');
const shipImageText = document.getElementById('ship-image-text');

// 1. Функція завантаження збережених даних корабля при старті
function loadShipData() {
    let savedName = localStorage.getItem('cosmic_ship_name');
    let savedImage = localStorage.getItem('cosmic_ship_image');

    // Відновлюємо назву
    if (savedName && shipNameInput) {
        shipNameInput.value = savedName;
    }

    // Відновлюємо картинку
    if (savedImage && shipImgPreview && shipImageText) {
        shipImgPreview.src = savedImage;
        shipImgPreview.style.display = 'block'; // Показуємо тег img
        shipImageText.style.display = 'none';   // Ховаємо текст-плейсхолдер
    }
}

// 2. Зберігаємо назву автоматично при введенні кожної літери!
if (shipNameInput) {
    shipNameInput.addEventListener('input', function() {
        localStorage.setItem('cosmic_ship_name', shipNameInput.value);
    });
}

// 3. Логіка завантаження картинки
if (shipImageContainer && shipImageUpload) {
    
    // Коли клікаємо на блок - імітуємо клік по прихованому інпуту файлу
    shipImageContainer.addEventListener('click', function() {
        shipImageUpload.click();
    });

    // Коли гравець обрав файл на своєму ПК
    shipImageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0]; // Беремо перший обраний файл
        
        if (file) {
            // Використовуємо FileReader для перетворення файлу у текст (Base64)
            const reader = new FileReader();
            
            // Що робити, коли файл прочитано:
            reader.onload = function(e) {
                const base64Image = e.target.result; 
                
                try {
                    // СПРОБУЄМО зберегти в пам'ять (тут може статися помилка ліміту)
                    localStorage.setItem('cosmic_ship_image', base64Image);
                    
                    // Якщо помилки не сталося - показуємо картинку на екрані
                    shipImgPreview.src = base64Image;
                    shipImgPreview.style.display = 'block';
                    shipImageText.style.display = 'none';
                    
                } catch (error) {
                    // ЯКЩО ФАЙЛ ЗАВЕЛИКИЙ (QuotaExceededError)
                    console.error("Помилка збереження:", error);
                    alert("Помилка! Файл занадто великий для пам'яті браузера. Будь ласка, оберіть картинку меншого розміру (до 1-2 МБ).");
                }
            };
            
            // Даємо команду прочитати файл
            reader.readAsDataURL(file); 
        }
    });
}

// Запускаємо відновлення даних при завантаженні сторінки
loadShipData();