import React, { useState, useRef, useCallback, useEffect } from 'react';
import Cancha from './Cancha';
import './css/Plano.css';

interface PlanoProps {
  width?: number;
  height?: number;
  gridSize?: number;
  minZoom?: number;
  maxZoom?: number;
  complejoId?: string;
  isEditMode?: boolean;
  repositionMode?: string | null;
  onEditCancha?: (cancha: any) => void;
  onDeleteCancha?: (cancha: any) => void;
  onRepositionCancha?: (cancha: any) => void;
  onPositionUpdate?: (canchaId: string, newPosition: any) => void;
  onCancelReposition?: () => void;
}

const Plano: React.FC<PlanoProps> = ({
  width = 800,
  height = 600,
  gridSize = 20,
  minZoom = 0.5,
  maxZoom = 3,
  complejoId,
  isEditMode = false,
  repositionMode = null,
  onEditCancha,
  onDeleteCancha,
  onRepositionCancha,
  onPositionUpdate,
  onCancelReposition
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [canchas, setCanchas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCancha, setSelectedCancha] = useState<string | null>(null);
  
  const planoRef = useRef<HTMLDivElement>(null);

  const loadCanchas = useCallback(async () => {
    if (!complejoId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/complejos/${complejoId}/canchas`);
      
      if (response.ok) {
        const data = await response.json();
        // Asignar coordenadas aleatorias a canchas que no las tengan
        const canchasConCoordenadas = data.map((cancha: any, index: number) => ({
          ...cancha,
          coordenadas_mapa: cancha.coordenadas_mapa || {
            x: 150 + (index % 4) * 150,
            y: 100 + Math.floor(index / 4) * 120
          }
        }));
        setCanchas(canchasConCoordenadas);
      } else {
        console.error('Error al cargar canchas:', response.statusText);
      }
    } catch (error) {
      console.error('Error al cargar canchas:', error);
    } finally {
      setLoading(false);
    }
  }, [complejoId]);

  // Cargar canchas cuando cambie el complejoId
  useEffect(() => {
    if (complejoId) {
      loadCanchas();
    }
  }, [complejoId, loadCanchas]);

  const handleCanchaClick = (cancha: any) => {
    setSelectedCancha(selectedCancha === cancha.id ? null : cancha.id);
  };

  // Funciones de zoom
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.2, maxZoom));
  }, [maxZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.2, minZoom));
  }, [minZoom]);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // Funciones de pan (arrastrar)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // No permitir pan si hay una cancha en modo reposición
    if (repositionMode) return;
    
    if (e.button === 0) { // Solo botón izquierdo
      setIsPanning(true);
      setPanStart({
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y
      });
    }
  }, [panOffset, repositionMode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // No permitir pan si hay una cancha en modo reposición
    if (repositionMode) return;
    
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  }, [isPanning, panStart, repositionMode]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Función para generar el patrón de cuadrícula
  const generateGridPattern = () => {
    const scaledGridSize = gridSize * zoom;
    return {
      backgroundImage: `
        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
      `,
      backgroundSize: `${scaledGridSize}px ${scaledGridSize}px`,
      backgroundPosition: `${panOffset.x % scaledGridSize}px ${panOffset.y % scaledGridSize}px`,
      backgroundRepeat: 'repeat'
    };
  };

  // Estilos del contenedor principal
  const planoStyles = {
    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
    transformOrigin: 'center center',
    width: '100%',
    height: '100%'
  };

  return (
    <div className="plano-container">
      {/* Controles de Zoom */}
      <div className="zoom-controls">
        <button
          className="zoom-btn zoom-out"
          onClick={handleZoomOut}
          disabled={zoom <= minZoom}
          title="Alejar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>
        
        <button
          className="zoom-btn zoom-reset"
          onClick={handleResetZoom}
          title="Restablecer zoom"
        >
          {Math.round(zoom * 100)}%
        </button>
        
        <button
          className="zoom-btn zoom-in"
          onClick={handleZoomIn}
          disabled={zoom >= maxZoom}
          title="Acercar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>
      </div>

      {/* Información de estado */}
      <div className="plano-info">
        <span className="zoom-level">Zoom: {Math.round(zoom * 100)}%</span>
        <span className="pan-info">
          Pan: ({Math.round(panOffset.x)}, {Math.round(panOffset.y)})
        </span>
      </div>

      {/* Área principal del plano */}
      <div 
        className={`plano-area ${isPanning ? 'panning' : ''}`}
        style={{ 
          ...generateGridPattern()
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          ref={planoRef}
          className="plano-grid"
          style={planoStyles}
        >
          {/* Indicador del centro */}
          <div className="center-indicator">
            <div className="center-cross"></div>
          </div>

          {/* Área donde se muestran las canchas */}
          <div className="canchas-container">
            {loading && (
              <div className="loading-canchas">
                <span>🔄</span>
                <p>Cargando canchas...</p>
              </div>
            )}
            
            {!loading && canchas.length === 0 && (
              <div className="placeholder-cancha">
                <span>🏟️</span>
                <p>Las canchas aparecerán aquí</p>
              </div>
            )}

            {!loading && canchas.length > 0 && canchas.map((cancha) => (
              <Cancha
                key={cancha.id}
                cancha={cancha}
                onClick={handleCanchaClick}
                isSelected={selectedCancha === cancha.id}
                isEditMode={isEditMode}
                isRepositionMode={repositionMode === cancha.id}
                onEdit={onEditCancha}
                onDelete={onDeleteCancha}
                onReposition={onRepositionCancha}
                onPositionUpdate={onPositionUpdate}
                onCancelReposition={onCancelReposition}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="plano-instructions">
        <p>
          <strong>Controles:</strong> 
          Arrastra para mover • Botones para zoom • Click derecho para menú contextual
        </p>
      </div>
    </div>
  );
};

export default Plano;
