import { useState } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import ShipProfile from './components/ShipProfile';
import ShipStats from './components/ShipStats';
import Expeditions from './components/Expeditions';
import TravelLog from './components/TravelLog';

function App() {
  // 1. СТАН ІСТОРІЇ ТЕПЕР ЖИВЕ ТУТ!
  const [history, setHistory] = useState([]);

  // 2. Функція для додавання нового запису в журнал
  const addLogEntry = (missionName, status, reward) => {
    const newEntry = {
      id: Date.now(), // Унікальний ID на основі часу
      mission: missionName,
      status: status,
      date: new Date().toLocaleDateString(), // Поточна дата
      reward: reward
    };
    // Додаємо нову місію на початок масиву
    setHistory((prevHistory) => [newEntry, ...prevHistory]);
  };

  return (
    <HashRouter>
      <header>
        <h1>Cosmic Expeditions</h1>
        <nav>
          <ul>
            <li><Link to="/" style={{color: 'white', textDecoration: 'none'}}>Командний центр</Link></li>
            <li><Link to="/missions" style={{color: 'white', textDecoration: 'none'}}>Експедиції</Link></li>
            <li><Link to="/log" style={{color: 'white', textDecoration: 'none'}}>Бортовий журнал</Link></li>
          </ul>
        </nav>
      </header>

      <main className="game-container">
        <Routes>
          <Route path="/" element={
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: '20px' }}>
              <ShipProfile />
              <ShipStats />
            </div>
          } />
          
          {/* Передаємо функцію addLogEntry у компонент Експедицій */}
          <Route path="/missions" element={<Expeditions addLogEntry={addLogEntry} />} />
          
          {/* Передаємо сам масив history та функцію для його очищення у Журнал */}
          <Route path="/log" element={<TravelLog history={history} setHistory={setHistory} />} />
        </Routes>
      </main>
      
      <footer>
        <div className="footer-contacts">
            <p><strong>Контакти командного центру:</strong></p>
            <p>Адреса: Сектор 4, Космічна станція "Омега"</p>
        </div>
        <div className="footer-copy">
            <p>&copy; 2026 WebDev - React Version</p>
        </div>
      </footer>
    </HashRouter>
  );
}

export default App;