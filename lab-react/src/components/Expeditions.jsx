import { useState } from 'react';

const missionsData = [
    { id: 1, name: "Дослідження Сіріуса", type: "дослідницька", difficulty: "низька" },
    { id: 2, name: "Порятунок капсули 42", type: "рятувальна", difficulty: "висока" },
    { id: 3, name: "Заснування бази Альфа", type: "колонізація", difficulty: "середня" },
    { id: 4, name: "Аналіз туманності Оріона", type: "дослідницька", difficulty: "середня" },
    { id: 5, name: "Евакуація шахтарів-ботів", type: "рятувальна", difficulty: "низька" },
    { id: 6, name: "Аванпост на Екзопланеті", type: "колонізація", difficulty: "висока" }
];

// Приймаємо функцію addLogEntry з App.jsx
export default function Expeditions({ addLogEntry }) {
    const [filterType, setFilterType] = useState('всі');
    const [filterDifficulty, setFilterDifficulty] = useState('всі');
    
    // СТАН ДЛЯ ТАЙМЕРА
    const [activeMissionId, setActiveMissionId] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);

    const filteredMissions = missionsData.filter(mission => {
        const matchType = filterType === 'всі' || mission.type === filterType;
        const matchDifficulty = filterDifficulty === 'всі' || mission.difficulty === filterDifficulty;
        return matchType && matchDifficulty;
    });

    // ФУНКЦІЯ СТАРТУ ПОЛЬОТУ
    const startFlight = (mission) => {
        if (activeMissionId !== null) {
            alert("Корабель вже у польоті! Дочекайтеся завершення поточної місії.");
            return;
        }

        setActiveMissionId(mission.id);
        setTimeLeft(5); // Тривалість польоту: 5 секунд (для тесту)

        // Запускаємо відлік
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    finishFlight(mission); // Викликаємо фініш, коли час вийшов
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    // ФУНКЦІЯ ЗАВЕРШЕННЯ ПОЛЬОТУ
    const finishFlight = (mission) => {
        setActiveMissionId(null);
        
        // Генеруємо випадковий результат (70% на успіх)
        const isSuccess = Math.random() > 0.3; 
        const status = isSuccess ? 'success' : 'failure';
        const reward = isSuccess ? '+50 ОЗ, +100 Енергії' : '-20 ОЗ, -50 Енергії';
        
        // Відправляємо запис у Журнал (в App.jsx)
        addLogEntry(mission.name, status, reward);
        
        alert(`Місія "${mission.name}" завершена!\nРезультат: ${isSuccess ? 'УСПІХ' : 'ПРОВАЛ'}\nПеревірте Бортовий журнал.`);
    };

    return (
        <div className="action-menu" style={{ width: '100%' }}>
            <h2>Доступні експедиції</h2>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <label style={{ marginRight: '10px' }}>Тип місії:</label>
                    <select className="action-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="всі">Всі типи</option>
                        <option value="дослідницька">Дослідницькі</option>
                        <option value="рятувальна">Рятувальні</option>
                        <option value="колонізація">Колонізація</option>
                    </select>
                </div>
                <div>
                    <label style={{ marginRight: '10px' }}>Складність:</label>
                    <select className="action-select" value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}>
                        <option value="всі">Будь-яка</option>
                        <option value="низька">Низька</option>
                        <option value="середня">Середня</option>
                        <option value="висока">Висока</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                {filteredMissions.length > 0 ? (
                    filteredMissions.map((mission) => (
                        <div key={mission.id} style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #45C1EB' }}>
                            <h3 style={{ marginTop: 0 }}>{mission.name}</h3>
                            <p><strong>Тип:</strong> <span style={{ textTransform: 'capitalize' }}>{mission.type}</span></p>
                            <p><strong>Складність:</strong> {mission.difficulty}</p>
                            
                            {/* Кнопка змінюється на таймер, якщо це активна місія */}
                            <button 
                                className="action-btn" 
                                style={{ 
                                    marginTop: '10px', 
                                    backgroundColor: activeMissionId === mission.id ? '#FFC107' : '',
                                    color: activeMissionId === mission.id ? '#333' : ''
                                }}
                                onClick={() => startFlight(mission)}
                                disabled={activeMissionId !== null} // Блокуємо всі кнопки, поки йде політ
                            >
                                {activeMissionId === mission.id ? `В польоті... ${timeLeft}с` : 'Почати місію'}
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#FF5722' }}>За вашими критеріями місій не знайдено.</p>
                )}
            </div>
        </div>
    );
}