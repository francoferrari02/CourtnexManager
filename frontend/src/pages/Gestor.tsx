import React, { useState, useEffect } from 'react';
import { GestorPlano } from '../components/GestorDeCanchas';
import './Gestor.css';

interface Complejo {
  id: string;
  nombre: string;
  direccion: string;
  telefono?: string;
  email?: string;
  horario_apertura: string;
  horario_cierre: string;
  plan_suscripcion: string;
  activo: boolean;
  created_at: string;
}

const Gestor: React.FC = () => {
  const [complejo, setComplejo] = useState<Complejo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplejo = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/complejos');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Tomamos el primer complejo de la lista
        if (data && data.length > 0) {
          setComplejo(data[0]);
        } else {
          setError('No se encontraron complejos en la base de datos');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        console.error('Error fetching complejo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplejo();
  }, []);

  const formatTime = (time: string): string => {
    return time.slice(0, 5); // HH:MM format
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="gestor-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando información del complejo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gestor-container">
        <div className="error">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!complejo) {
    return (
      <div className="gestor-container">
        <div className="no-data">
          <h2>📋 Sin Datos</h2>
          <p>No se encontró información del complejo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gestor-container">
      {/* Header con información del complejo */}
      <header className="complejo-header">
        <div className="complejo-info">
          <div className="complejo-main">
            <h1 className="complejo-nombre">
              🏟️ {complejo.nombre}
            </h1>
            <div className="complejo-status">
              <span className={`status-badge ${complejo.activo ? 'active' : 'inactive'}`}>
                {complejo.activo ? '🟢 Activo' : '🔴 Inactivo'}
              </span>
              <span className="plan-badge">
                {complejo.plan_suscripcion === 'premium' ? '⭐ Premium' : '📋 Base'}
              </span>
            </div>
          </div>
          
          <div className="complejo-details">
            <div className="detail-group">
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <span className="detail-label">Dirección:</span>
                <span className="detail-value">{complejo.direccion}</span>
              </div>
              
              {complejo.telefono && (
                <div className="detail-item">
                  <span className="detail-icon">📞</span>
                  <span className="detail-label">Teléfono:</span>
                  <span className="detail-value">{complejo.telefono}</span>
                </div>
              )}
              
              {complejo.email && (
                <div className="detail-item">
                  <span className="detail-icon">📧</span>
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{complejo.email}</span>
                </div>
              )}
            </div>
            
            <div className="detail-group">
              <div className="detail-item">
                <span className="detail-icon">⏰</span>
                <span className="detail-label">Horarios:</span>
                <span className="detail-value">
                  {formatTime(complejo.horario_apertura)} - {formatTime(complejo.horario_cierre)}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">📅</span>
                <span className="detail-label">Creado:</span>
                <span className="detail-value">{formatDate(complejo.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Área principal blanca */}
      <main className="gestor-main">
        <div className="white-area">
          <div className="content-section">
            <h2>🏗️ Plano del Complejo</h2>
            <p>Visualiza y organiza las canchas de tu complejo deportivo</p>
            
            {/* Componente GestorPlano */}
            <div className="plano-wrapper">
              <GestorPlano 
                width={800}
                height={500}
                gridSize={25}
                minZoom={0.3}
                maxZoom={4}
              />
            </div>
          </div>
          
          <div className="placeholder-content">
            <h3>🚧 Próximas Funcionalidades</h3>
            <div className="placeholder-cards">
              <div className="placeholder-card">
                <h4>🏟️ Gestión de Canchas</h4>
                <p>Agregar, editar y posicionar canchas en el plano</p>
              </div>
              <div className="placeholder-card">
                <h4>🔄 Rotación y Redimensión</h4>
                <p>Rotar y ajustar el tamaño de las canchas</p>
              </div>
              <div className="placeholder-card">
                <h4>� Vista de Disponibilidad</h4>
                <p>Ver estado de ocupación en tiempo real</p>
              </div>
              <div className="placeholder-card">
                <h4>� Métricas del Complejo</h4>
                <p>Estadísticas de uso y ocupación</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Gestor;
