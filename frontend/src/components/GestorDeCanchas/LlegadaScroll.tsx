import React, { useState } from 'react';
import TurnoCard from './TurnoCard';
import './css/LlegadaScroll.css';

interface TurnoData {
  id: string;
  horario: string;
  cancha: string;
  cliente: string;
  estado: 'pendiente' | 'jugando';
}

interface LlegadaScrollProps {
  turnos?: TurnoData[];
  onConfirmarAsistencia?: (turnoId: string) => void;
  onFinalizarTurno?: (turnoId: string) => void;
}

const LlegadaScroll: React.FC<LlegadaScrollProps> = ({
  turnos = [],
  onConfirmarAsistencia,
  onFinalizarTurno
}) => {
  const [turnosState, setTurnosState] = useState<TurnoData[]>(turnos);

  const handleConfirmarAsistencia = (turnoId: string) => {
    // Actualizar el estado del turno localmente
    setTurnosState(prevTurnos =>
      prevTurnos.map(turno =>
        turno.id === turnoId
          ? { ...turno, estado: 'jugando' as const }
          : turno
      )
    );

    // Llamar al callback padre si existe
    if (onConfirmarAsistencia) {
      onConfirmarAsistencia(turnoId);
    }
  };

  // Separar turnos por estado para mostrar primero los pendientes
  const turnosPendientes = turnosState.filter(turno => turno.estado === 'pendiente');
  const turnosJugando = turnosState.filter(turno => turno.estado === 'jugando');
  const turnosOrdenados = [...turnosPendientes, ...turnosJugando];

  return (
    <div className="llegada-scroll">
      <div className="llegada-header">
        <h3 className="llegada-titulo">Estado de Turnos</h3>
        <div className="llegada-contador">
          <span className="contador-pendientes">
            {turnosPendientes.length} pendientes
          </span>
          <span className="contador-jugando">
            {turnosJugando.length} jugando
          </span>
        </div>
      </div>
      
      <div className="turnos-container">
        {turnosOrdenados.length === 0 ? (
          <div className="sin-turnos">
            <div className="sin-turnos-icono">📅</div>
            <p className="sin-turnos-texto">No hay turnos programados</p>
            <p className="sin-turnos-subtexto">
              Los turnos aparecerán aquí cuando llegue su horario
            </p>
          </div>
        ) : (
          turnosOrdenados.map(turno => (
            <TurnoCard
              key={turno.id}
              turno={turno}
              onConfirmarAsistencia={handleConfirmarAsistencia}
              onFinalizarTurno={onFinalizarTurno}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Función helper para agregar turnos desde fuera del componente
export const useLlegadaScroll = () => {
  const [turnos, setTurnos] = useState<TurnoData[]>([]);

  const agregarTurno = (nuevoTurno: Omit<TurnoData, 'id'>) => {
    const turno: TurnoData = {
      ...nuevoTurno,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setTurnos(prevTurnos => [turno, ...prevTurnos]);
  };

  const confirmarAsistencia = (turnoId: string) => {
    setTurnos(prevTurnos =>
      prevTurnos.map(turno =>
        turno.id === turnoId
          ? { ...turno, estado: 'jugando' as const }
          : turno
      )
    );
  };

  return {
    turnos,
    agregarTurno,
    confirmarAsistencia
  };
};

export default LlegadaScroll;
