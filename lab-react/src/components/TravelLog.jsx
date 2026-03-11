import { useState } from 'react';

// Зверни увагу: ми передаємо history та setHistory у дужках функції!
export default function TravelLog({ history, setHistory }) {
    
    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <div className="history-section" style={{ width: '100%' }}>
            <h2>Бортовий журнал експедицій</h2>
            
            <div className="history-list">
                {history.length > 0 ? (
                    history.map((item) => (
                        <div key={item.id} className={`history-item ${item.status}`}>
                            <div className="history-info">
                                <strong>{item.mission}</strong>
                                <span style={{ fontSize: '12px', opacity: 0.8 }}>Дата: {item.date}</span>
                                <span className="history-rewards">Результат: {item.reward}</span>
                            </div>
                            <div style={{ fontWeight: 'bold', color: item.status === 'success' ? '#4CAF50' : '#F44336' }}>
                                {item.status === 'success' ? 'УСПІХ' : 'ПРОВАЛ'}
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#aaa', padding: '20px' }}>
                        Журнал порожній. Час вирушати у першу експедицію!
                    </p>
                )}
            </div>

            <button 
                className="action-btn" 
                style={{ backgroundColor: '#F44336', marginTop: '15px' }}
                onClick={clearHistory}
                disabled={history.length === 0}
            >
                Очистити бортовий журнал
            </button>
        </div>
    );
}