import { useState, useEffect } from 'react';

export default function ShipProfile() {
    // Створюємо "Стан" для імені та картинки. 
    // Коли ці змінні оновлюються, React САМ перемальовує компонент!
    const [shipName, setShipName] = useState('Зоряний Мандрівник');
    const [shipImage, setShipImage] = useState(null);

    // useEffect спрацьовує один раз при завантаженні сторінки
    // Тут ми дістаємо збережені дані з пам'яті
    useEffect(() => {
        const savedName = localStorage.getItem('cosmic_ship_name');
        const savedImage = localStorage.getItem('cosmic_ship_image');
        if (savedName) setShipName(savedName);
        if (savedImage) setShipImage(savedImage);
    }, []);

    // Функція, що працює, коли ми друкуємо текст
    const handleNameChange = (e) => {
        const newName = e.target.value;
        setShipName(newName); // Оновлюємо екран
        localStorage.setItem('cosmic_ship_name', newName); // Зберігаємо в пам'ять
    };

    // Функція для завантаження картинки
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;
                try {
                    localStorage.setItem('cosmic_ship_image', base64);
                    setShipImage(base64); // Оновлюємо картинку на екрані
                } catch (error) {
                    alert("Помилка! Файл занадто великий для пам'яті браузера.");
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        // Зверни увагу: замість class у React пишеться className!
        <div className="ship-preview">
            <input 
                type="text" 
                className="ship-name-input" 
                value={shipName}
                onChange={handleNameChange}
                placeholder="Введіть назву корабля..."
            />
            
            <div 
                id="ship-image-container" 
                title="Натисніть, щоб обрати зображення"
                onClick={() => document.getElementById('ship-image-upload').click()}
            >
                {/* Умовний рендерінг: якщо картинки немає, показуємо текст, якщо є - тег img */}
                {!shipImage ? (
                    <span id="ship-image-text">[ Натисніть, щоб обрати креслення корабля ]</span>
                ) : (
                    <img 
                        id="ship-img-preview" 
                        src={shipImage} 
                        alt="Мій корабель"  
                    />
                )}
            </div>
            
            <input 
                type="file" 
                id="ship-image-upload" 
                accept="image/*" 
                onChange={handleImageUpload}
            />
        </div>
    );
}