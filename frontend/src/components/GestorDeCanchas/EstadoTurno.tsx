import React from 'react';
import './css/EstadoTurno.css';

interface TurnoData {
  id: string;
  horario: string;
  cancha: string;
  cliente: string;
  estado: 'pendiente' | 'jugando';
}

interface EstadoTurnoProps {
  turno: TurnoData;
  onConfirmarAsistencia?: (turnoId: string) => void;
  onFinalizarTurno?: (turnoId: string) => void;
}

const EstadoTurno: React.FC<EstadoTurnoProps> = ({
  turno,
  onConfirmarAsistencia,
  onFinalizarTurno
}) => {
  const handleConfirmarAsistencia = () => {
    if (onConfirmarAsistencia && turno.estado === 'pendiente') {
      onConfirmarAsistencia(turno.id);
    }
  };

  const handleFinalizarTurno = () => {
    if (onFinalizarTurno) {
      onFinalizarTurno(turno.id);
    }
  };

  return (
    <div className={`estado-turno ${turno.estado}`}>
      <div className="turno-header">
        <div className="turno-tiempo">
          <span className="hora">{turno.horario}</span>
          <span className={`estado-badge ${turno.estado}`}>
            {turno.estado === 'pendiente' ? 'ESPERANDO' : 'JUGANDO'}
          </span>
        </div>
        <div className="turno-cancha">
          {turno.cancha}
        </div>
      </div>

      <div className="turno-content">
        <div className="cliente-info">
          <div className="cliente-icon">
            {turno.cliente.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="cliente-details">
            <div className="cliente-nombre">{turno.cliente}</div>
            <div className="turno-duracion">60 min</div>
          </div>
        </div>
      </div>

      <div className="turno-actions">
        {turno.estado === 'pendiente' && (
          <button
            className="btn-confirmar"
            onClick={handleConfirmarAsistencia}
            title="Confirmar llegada"
          >
            ✓ CONFIRMAR LLEGADA
          </button>
        )}
        
        {turno.estado === 'jugando' && (
          <button
            className="btn-finalizar"
            onClick={handleFinalizarTurno}
            title="Finalizar turno"
          >
            ⏹ FINALIZAR TURNO
          </button>
        )}
      </div>

      {/* Indicador visual de estado */}
      <div className={`status-indicator ${turno.estado}`}></div>
    </div>
  );
};

export default EstadoTurno;
