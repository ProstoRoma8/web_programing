import { useState } from 'react';

export default function ShipStats() {
    // Зберігаємо показники у стані (можна буде легко змінювати їх під час місій)
    const [stats, setStats] = useState({
        health: { name: "Здоров'я", value: "8500 ОЗ", percent: 85, color: '#4CAF50' },
        shields: { name: "Щити", value: "100%", percent: 100, color: '#2196F3' },
        energy: { name: "Енергія", value: "1000%", percent: 100, color: '#FFC107' },
        fuel: { name: "Пальне", value: "100%", percent: 100, color: '#FF9800' }
    });
    
    const [crew, setCrew] = useState(124); // Кількість екіпажу

    return (
        // Використовуємо твій клас action-menu для красивого напівпрозорого фону
        <div className="action-menu" style={{ flex: 1, minHeight: 'auto' }}>
            <h2 style={{ marginTop: 0, textAlign: 'center' }}>Статус систем</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
                {/* Перебираємо об'єкт stats і малюємо смужки за допомогою твоїх CSS-класів */}
                {Object.entries(stats).map(([key, stat]) => (
                    <div key={key}>
                        <div className="stat-header">
                            <span>{stat.name}</span>
                        </div>
                        <div className="bar">
                            {/* Додаємо inline-стиль для ширини та кольору заливки */}
                            <div 
                                className="fill" 
                                style={{ width: `${stat.percent}%`, backgroundColor: stat.color, height: '100%' }}
                            ></div>
                        </div>
                        <div className="stat-value">{stat.value}</div>
                    </div>
                ))}

                {/* Блок екіпажу (без смужки, як у твоєму оригіналі) */}
                <div style={{ marginTop: '10px', paddingTop: '15px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div className="stat-header">
                        <span>Екіпаж</span>
                    </div>
                    <div className="crew-value">{crew} / 150 осіб</div>
                </div>
            </div>
        </div>
    );
}