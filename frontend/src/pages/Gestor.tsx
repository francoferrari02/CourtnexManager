import React, { useState, useEffect } from 'react';
import { GestorPlano } from '../components/GestorDeCanchas';
import LlegadaScroll from '../components/GestorDeCanchas/LlegadaScroll';
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

interface TurnoData {
  id: string;
  horario: string;
  cancha: string;
  cliente: string;
  estado: 'pendiente' | 'jugando';
}

const Gestor: React.FC = () => {
  const [complejo, setComplejo] = useState<Complejo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [turnos, setTurnos] = useState<TurnoData[]>([]);

  // Debug: mostrar el estado actual de turnos
  useEffect(() => {
    console.log('📋 Estado actual de turnos:', turnos);
  }, [turnos]);

  // Función para agregar turnos de prueba
  const agregarTurnoPrueba = () => {
    console.log('🎯 Agregando turno de prueba...');
    const canchas = ['Cancha 1', 'Cancha 2', 'Cancha 3', 'Cancha Principal'];
    const clientes = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martín', 'Diego Silva'];
    
    const now = new Date();
    const horario = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const nuevoTurno: TurnoData = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      horario: horario,
      cancha: canchas[Math.floor(Math.random() * canchas.length)],
      cliente: clientes[Math.floor(Math.random() * clientes.length)],
      estado: 'pendiente'
    };

    console.log('🎯 Nuevo turno creado:', nuevoTurno);
    setTurnos(prev => {
      const newTurnos = [nuevoTurno, ...prev];
      console.log('🎯 Turnos actualizados:', newTurnos);
      return newTurnos;
    });
  };

  // Función para confirmar asistencia
  const confirmarAsistencia = (turnoId: string) => {
    setTurnos(prev =>
      prev.map(turno =>
        turno.id === turnoId
          ? { ...turno, estado: 'jugando' as const }
          : turno
      )
    );
  };

  // Función para limpiar todos los turnos
  const limpiarTurnos = () => {
    console.log('🗑️ Limpiando todos los turnos...');
    setTurnos([]);
  };

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
    
    // Agregar algunos turnos de ejemplo al cargar
    const turnosEjemplo: TurnoData[] = [
      {
        id: '1',
        horario: '14:30',
        cancha: 'Cancha Principal',
        cliente: 'Juan Pérez',
        estado: 'pendiente'
      },
      {
        id: '2',
        horario: '15:00',
        cancha: 'Cancha 2',
        cliente: 'María García',
        estado: 'jugando'
      }
    ];
    setTurnos(turnosEjemplo);
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
            
            {/* Área de contenido principal con plano y turnos */}
            <div className="main-content-area">
              {/* Componente GestorPlano */}
              <div className="plano-wrapper">
                <GestorPlano 
                  width={800}
                  height={500}
                  gridSize={25}
                  minZoom={0.3}
                  maxZoom={4}
                  complejoId={complejo?.id}
                />
              </div>
              
              {/* Panel de turnos */}
              <div className="turnos-panel">
                <div className="turnos-controls">
                  <h3>🕐 Gestión de Turnos</h3>
                  <div className="control-buttons">
                    <button 
                      className="btn-agregar-turno"
                      onClick={() => {
                        console.log('🔥 Botón clickeado!');
                        agregarTurnoPrueba();
                      }}
                      title="Agregar turno de prueba"
                    >
                      ➕ Agregar Turno
                    </button>
                    <button 
                      className="btn-limpiar-turnos"
                      onClick={() => {
                        console.log('🗑️ Botón limpiar clickeado!');
                        limpiarTurnos();
                      }}
                      title="Limpiar todos los turnos"
                    >
                      🗑️ Limpiar
                    </button>
                  </div>
                </div>
                
                <LlegadaScroll 
                  turnos={turnos}
                  onConfirmarAsistencia={confirmarAsistencia}
                />
              </div>
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
