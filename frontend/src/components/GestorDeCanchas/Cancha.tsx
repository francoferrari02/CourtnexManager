import React, { useState, useEffect } from 'react';
import './css/Cancha.css';

// Importar las imágenes de las canchas
import CanchaFutbolImg from '../../assets/CanchaFutbol.PNG';
import CanchaPadelImg from '../../assets/CanchaPadel.PNG';
import CanchaTenisImg from '../../assets/CanchaTenis.PNG';
import CanchaBasketImg from '../../assets/CanchaBasket.PNG';

interface CanchaData {
  id: string;
  nombre: string;
  tipo_deporte: string;
  dimensiones: {
    largo: number;
    ancho: number;
    unidad: string;
    superficie?: string;
  };
  precio_hora: number;
  iluminacion: boolean;
  techada: boolean;
  estado: string;
  coordenadas_mapa?: {
    x: number;
    y: number;
  };
}

interface CanchaProps {
  cancha: CanchaData;
  onClick?: (cancha: CanchaData) => void;
  isSelected?: boolean;
  isEditMode?: boolean;
  isRepositionMode?: boolean;
  onEdit?: (cancha: CanchaData) => void;
  onDelete?: (cancha: CanchaData) => void;
  onReposition?: (cancha: CanchaData) => void;
  onPositionUpdate?: (canchaId: string, newPosition: any) => void;
  onCancelReposition?: () => void;
}

const Cancha: React.FC<CanchaProps> = ({
  cancha,
  onClick,
  isSelected = false,
  isEditMode = false,
  isRepositionMode = false,
  onEdit,
  onDelete,
  onReposition,
  onPositionUpdate,
  onCancelReposition
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset entre cursor y posición de la cancha
  const [currentPosition, setCurrentPosition] = useState(
    cancha.coordenadas_mapa || { x: 100, y: 130 }
  );
  const [targetPosition, setTargetPosition] = useState(
    cancha.coordenadas_mapa || { x: 100, y: 130 }
  ); // Posición objetivo hacia la que se mueve la cancha

  // Actualizar posición cuando cambie la cancha
  useEffect(() => {
    if (!isRepositionMode) {
      const newPos = cancha.coordenadas_mapa || { x: 100, y: 130 };
      setCurrentPosition(newPos);
      setTargetPosition(newPos);
    }
  }, [cancha.coordenadas_mapa, isRepositionMode]);

  // Timer para interpolar suavemente hacia la posición objetivo
  useEffect(() => {
    let animationFrame: number;
    
    const interpolatePosition = () => {
      if (isDragging && isRepositionMode) {
        setCurrentPosition(prev => {
          const dx = targetPosition.x - prev.x;
          const dy = targetPosition.y - prev.y;
          
          // Factor de interpolación (más alto = más rápido, más bajo = más suave)
          const lerpFactor = 0.3;
          
          // Si estamos muy cerca del objetivo, usar la posición exacta
          if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
            return targetPosition;
          }
          
          // Interpolar hacia el objetivo
          return {
            x: prev.x + dx * lerpFactor,
            y: prev.y + dy * lerpFactor
          };
        });
        
        animationFrame = requestAnimationFrame(interpolatePosition);
      }
    };
    
    if (isDragging && isRepositionMode) {
      animationFrame = requestAnimationFrame(interpolatePosition);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isDragging, isRepositionMode, targetPosition]);

  // Función para obtener las coordenadas relativas al plano
  const getPlanoRelativeCoordinates = (clientX: number, clientY: number) => {
    const planoContainer = document.querySelector('.plano-grid') as HTMLElement;
    const planoArea = document.querySelector('.plano-area') as HTMLElement;
    
    if (!planoContainer || !planoArea) {
      return { x: clientX, y: clientY };
    }

    const planoAreaRect = planoArea.getBoundingClientRect();
    const transform = window.getComputedStyle(planoContainer).transform;
    
    // Extraer valores de transform: translate(x, y) scale(z)
    let translateX = 0, translateY = 0, scale = 1;
    if (transform && transform !== 'none') {
      const matrix = transform.match(/matrix\(([^)]+)\)/);
      if (matrix) {
        const values = matrix[1].split(',').map(v => parseFloat(v.trim()));
        if (values.length >= 6) {
          scale = values[0]; // scaleX (asumimos que scaleX === scaleY)
          translateX = values[4];
          translateY = values[5];
        }
      }
    }

    // Convertir coordenadas del cliente a coordenadas del plano
    const relativeX = clientX - planoAreaRect.left;
    const relativeY = clientY - planoAreaRect.top;
    
    // Ajustar por el transform del plano
    const planoX = (relativeX - translateX) / scale;
    const planoY = (relativeY - translateY) / scale;
    
    return { x: planoX, y: planoY };
  };

  // Manejar eventos globales de mouse para drag & drop
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && isRepositionMode) {
        e.preventDefault();
        
        // Obtener coordenadas relativas al plano
        const planoCoords = getPlanoRelativeCoordinates(e.clientX, e.clientY);
        
        // Aplicar el offset para mantener la posición relativa del cursor con la cancha
        const newTargetPosition = {
          x: planoCoords.x - dragOffset.x,
          y: planoCoords.y - dragOffset.y
        };
        
        // Actualizar la posición objetivo (no la actual)
        setTargetPosition(newTargetPosition);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging && isRepositionMode && onPositionUpdate) {
        setIsDragging(false);
        // Usar la posición objetivo final para la actualización
        onPositionUpdate(cancha.id, targetPosition);
      } else {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragOffset, targetPosition, isRepositionMode, onPositionUpdate, cancha.id]);
  const handleClick = (e: React.MouseEvent) => {
    if (isRepositionMode) {
      e.preventDefault();
      return; // No procesar clicks en modo reposición
    }
    
    if (onClick) {
      onClick(cancha);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(cancha);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(cancha);
    }
  };

  const handleReposition = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReposition) {
      onReposition(cancha);
    }
  };

  // Handlers para drag & drop en modo reposición
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isRepositionMode && e.button === 0) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      
      // Obtener coordenadas relativas al plano
      const planoCoords = getPlanoRelativeCoordinates(e.clientX, e.clientY);
      
      // Calcular offset entre el cursor y la posición actual de la cancha
      const offset = {
        x: planoCoords.x - currentPosition.x,
        y: planoCoords.y - currentPosition.y
      };
      
      setDragOffset(offset);
      
      // Sincronizar posición objetivo con la actual al inicio del drag
      setTargetPosition(currentPosition);
    }
  };

  // Handler para cancelar reposición con ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRepositionMode && onCancelReposition) {
        onCancelReposition();
      }
    };

    if (isRepositionMode) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRepositionMode, onCancelReposition]);

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isRepositionMode) {
      e.preventDefault();
      if (onCancelReposition) {
        onCancelReposition();
      }
    }
  };

  // Determinar la imagen de la cancha según el tipo de deporte
  const getCanchaImage = (tipo: string) => {
    const imageMap: { [key: string]: string } = {
      'futbol': CanchaFutbolImg,
      'futbol_5': CanchaFutbolImg,
      'futbol_7': CanchaFutbolImg,
      'futbol_11': CanchaFutbolImg,
      'tenis': CanchaTenisImg,
      'padel': CanchaPadelImg,
      'basquet': CanchaBasketImg,
      'voley': CanchaBasketImg,
      'hockey': CanchaFutbolImg,
      'multiuso': CanchaFutbolImg
    };
    return imageMap[tipo] || CanchaFutbolImg;
  };

  // Determinar el estado de la cancha para el borde
  const getEstadoInfo = (estado: string) => {
    const estadoMap: { [key: string]: { color: string; text: string } } = {
      'disponible': { color: '#22c55e', text: 'Disponible' },
      'ocupada': { color: '#ef4444', text: 'Ocupada' },
      'mantenimiento': { color: '#f59e0b', text: 'Mantenimiento' },
      'fuera_servicio': { color: '#6b7280', text: 'Fuera de Servicio' }
    };
    return estadoMap[estado] || { color: '#6b7280', text: 'Desconocido' };
  };

  const canchaImage = getCanchaImage(cancha.tipo_deporte);
  const estadoInfo = getEstadoInfo(cancha.estado);

  // Usar la posición actual si está en modo reposición, sino usar la de la cancha
  const position = isRepositionMode ? currentPosition : (cancha.coordenadas_mapa || { x: 100, y: 130 });

  return (
    <div
      className={`cancha-component ${isSelected ? 'selected' : ''} ${isEditMode ? 'edit-mode' : ''} ${isRepositionMode ? 'reposition-mode' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isRepositionMode ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
        zIndex: isRepositionMode ? 100 : (isDragging ? 110 : 20)
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      title={isRepositionMode ? 'Arrastra para mover - ESC para cancelar' : `${cancha.nombre} - ${cancha.tipo_deporte} - ${estadoInfo.text}`}
    >
      {/* Nombre fuera del recuadro, en la parte superior */}
      <div className="cancha-nombre-overlay">
        {cancha.nombre}
      </div>
      
      {/* Contenedor de la imagen */}
      <div 
        className="cancha-image-container"
        style={{
          backgroundImage: `url(${canchaImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderColor: estadoInfo.color,
          borderWidth: '3px',
          borderStyle: 'solid',
        }}
      />

      {/* Botones de edición (solo en modo edición) */}
      {isEditMode && (
        <div className="edit-buttons">
          <button
            className="edit-btn delete-btn"
            onClick={handleDelete}
            title="Eliminar cancha"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
          <button
            className="edit-btn edit-info-btn"
            onClick={handleEdit}
            title="Editar información"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="m18.5 2.5 a2.12 2.12 0 0 1 3 3l-9.5 9.5-4 1 1-4z"></path>
            </svg>
          </button>
          <button
            className="edit-btn reposition-btn"
            onClick={handleReposition}
            title="Reposicionar cancha"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 18L12 22L16 18"></path>
              <path d="M8 6L12 2L16 6"></path>
              <path d="M2 12L6 8L10 12L6 16L2 12Z"></path>
              <path d="M22 12L18 8L14 12L18 16L22 12Z"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Cancha;
