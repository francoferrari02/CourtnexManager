import React, { useState, useEffect } from 'react';
import { GestorPlano } from '../components/GestorDeCanchas';
import LlegadaScroll from '../components/GestorDeCanchas/LlegadaScroll';
import './PanelControl.css';

interface TurnoData {
  id: string;
  horario: string;
  cancha: string;
  cliente: string;
  estado: 'pendiente' | 'jugando';
}

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

const PanelControl: React.FC = () => {
  const [complejo, setComplejo] = useState<Complejo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [turnos, setTurnos] = useState<TurnoData[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar hora actual cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Función para agregar turnos de prueba (simulando llegadas automáticas)
  const simularLlegadaTurno = () => {
    const canchas = ['Cancha A', 'Cancha B', 'Cancha C', 'Cancha Principal', 'Cancha VIP'];
    const clientes = [
      'Juan Pérez', 'María García', 'Carlos López', 'Ana Martín', 
      'Diego Silva', 'Laura Torres', 'Miguel Santos', 'Carmen Ruiz'
    ];
    
    const now = new Date();
    const horario = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const nuevoTurno: TurnoData = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      horario: horario,
      cancha: canchas[Math.floor(Math.random() * canchas.length)],
      cliente: clientes[Math.floor(Math.random() * clientes.length)],
      estado: 'pendiente'
    };

    setTurnos(prev => [nuevoTurno, ...prev]);
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

  // Función para finalizar turno (remover de la lista)
  const finalizarTurno = (turnoId: string) => {
    setTurnos(prev => prev.filter(turno => turno.id !== turnoId));
  };

  // Simular llegadas automáticas cada 15 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% de probabilidad cada 15 segundos
        simularLlegadaTurno();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchComplejo = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/complejos');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
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
    
    // Agregar algunos turnos iniciales
    const turnosIniciales: TurnoData[] = [
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
        cancha: 'Cancha A',
        cliente: 'María García',
        estado: 'jugando'
      },
      {
        id: '3',
        horario: '15:30',
        cancha: 'Cancha B',
        cliente: 'Carlos López',
        estado: 'pendiente'
      }
    ];
    setTurnos(turnosIniciales);
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="panel-container">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <h2>Cargando Panel de Control...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel-container">
        <div className="error-screen">
          <h2>⚠️ Error de Conexión</h2>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Reintentar Conexión
          </button>
        </div>
      </div>
    );
  }

  if (!complejo) {
    return (
      <div className="panel-container">
        <div className="no-data-screen">
          <h2>📋 Sin Datos</h2>
          <p>No se encontró información del complejo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-container">
      {/* Header Superior */}
      <header className="panel-header">
        <div className="header-left">
          <h1 className="complejo-name">{complejo.nombre}</h1>
          <div className="status-indicators">
            <span className={`status-dot ${complejo.activo ? 'online' : 'offline'}`}></span>
            <span className="status-text">
              {complejo.activo ? 'En Línea' : 'Fuera de Línea'}
            </span>
          </div>
        </div>
        
        <div className="header-center">
          <div className="datetime-display">
            <div className="current-time">{formatTime(currentTime)}</div>
            <div className="current-date">{formatDate(currentTime)}</div>
          </div>
        </div>
        
        <div className="header-right">
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-number">{turnos.filter(t => t.estado === 'pendiente').length}</span>
              <span className="stat-label">Pendientes</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{turnos.filter(t => t.estado === 'jugando').length}</span>
              <span className="stat-label">Jugando</span>
            </div>
          </div>
          
          <button 
            className="simulate-button"
            onClick={simularLlegadaTurno}
            title="Simular llegada de cliente"
          >
            + Simular Llegada
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="panel-main">
        {/* Columna Izquierda - Plano */}
        <section className="plano-section">
          <div className="section-header">
            <h2>PLANO DE CANCHAS</h2>
            <div className="section-subtitle">Estado en tiempo real</div>
          </div>
          
          <div className="plano-container">
            <GestorPlano 
              width={800}
              height={600}
              gridSize={25}
              minZoom={0.3}
              maxZoom={4}
              complejoId={complejo?.id}
            />
          </div>
        </section>

        {/* Columna Derecha - Control de Turnos */}
        <section className="turnos-section">
          <div className="section-header">
            <h2>CONTROL DE TURNOS</h2>
            <div className="section-subtitle">Gestión de arribos y partidas</div>
          </div>
          
          <div className="turnos-container">
            <LlegadaScroll 
              turnos={turnos}
              onConfirmarAsistencia={confirmarAsistencia}
              onFinalizarTurno={finalizarTurno}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default PanelControl;
