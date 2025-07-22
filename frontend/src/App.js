import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🎾 CourtnexManager</h1>
        <p className="App-subtitle">
          Sistema de Gestión para Complejos Deportivos
        </p>
        <div className="App-features">
          <div className="feature-card">
            <h3>📅 Reservas</h3>
            <p>Gestión inteligente de reservas</p>
          </div>
          <div className="feature-card">
            <h3>🏟️ Canchas</h3>
            <p>Administración de espacios</p>
          </div>
          <div className="feature-card">
            <h3>👥 Clientes</h3>
            <p>Base de datos completa</p>
          </div>
          <div className="feature-card">
            <h3>💰 Pagos</h3>
            <p>Sistema de facturación</p>
          </div>
        </div>
        <div className="App-status">
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span>Backend: Conectando...</span>
          </div>
        </div>
        <p className="App-version">v1.0.0 - En Desarrollo</p>
      </header>
    </div>
  );
}

export default App;
