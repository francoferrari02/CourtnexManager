import React from 'react';
import Plano from './Plano';
import { BotonAgregarCancha, BotonEditar, BotonFiltrar } from './Botones';
import './GestorPlano.css';

interface GestorPlanoProps {
  width?: number;
  height?: number;
  gridSize?: number;
  minZoom?: number;
  maxZoom?: number;
}

const GestorPlano: React.FC<GestorPlanoProps> = ({
  width = 800,
  height = 600,
  gridSize = 20,
  minZoom = 0.5,
  maxZoom = 3
}) => {
  // Handlers para los botones (por ahora vacíos)
  const handleAgregarCancha = () => {
    console.log('Agregar cancha clicked');
    // TODO: Implementar funcionalidad
  };

  const handleEditar = () => {
    console.log('Editar clicked');
    // TODO: Implementar funcionalidad
  };

  const handleFiltrar = () => {
    console.log('Filtrar clicked');
    // TODO: Implementar funcionalidad
  };

  return (
    <div className="gestor-plano-container">
      {/* Barra de herramientas */}
      <div className="toolbar">
        <div className="toolbar-left">
          <h3 className="toolbar-title">Gestor de Canchas</h3>
        </div>
        
        <div className="toolbar-center">
          <div className="toolbar-buttons">
            <BotonAgregarCancha onClick={handleAgregarCancha} />
            <BotonEditar onClick={handleEditar} />
            <BotonFiltrar onClick={handleFiltrar} />
          </div>
        </div>
        
        <div className="toolbar-right">
          {/* Espacio para controles adicionales en el futuro */}
        </div>
      </div>

      {/* Área del plano */}
      <div className="plano-wrapper">
        <Plano 
          width={width}
          height={height}
          gridSize={gridSize}
          minZoom={minZoom}
          maxZoom={maxZoom}
        />
      </div>
    </div>
  );
};

export default GestorPlano;
