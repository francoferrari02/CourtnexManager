import React, { useState } from 'react';
import Plano from './Plano';
import CanchaForm from './CanchaForm';
import { BotonAgregarCancha, BotonEditar, BotonFiltrar } from './Botones';
import './css/GestorPlano.css';

interface GestorPlanoProps {
  width?: number;
  height?: number;
  gridSize?: number;
  minZoom?: number;
  maxZoom?: number;
  complejoId?: string;
}

const GestorPlano: React.FC<GestorPlanoProps> = ({
  width = 800,
  height = 600,
  gridSize = 20,
  minZoom = 0.5,
  maxZoom = 3,
  complejoId
}) => {
  const [isCanchaFormOpen, setIsCanchaFormOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Handlers para los botones
  const handleAgregarCancha = () => {
    console.log('Agregar cancha clicked');
    setIsCanchaFormOpen(true);
  };

  const handleEditar = () => {
    console.log('Editar clicked');
    // TODO: Implementar funcionalidad
  };

  const handleFiltrar = () => {
    console.log('Filtrar clicked');
    // TODO: Implementar funcionalidad
  };

  const handleCloseCanchaForm = () => {
    setIsCanchaFormOpen(false);
  };

  const handleSubmitCancha = async (canchaData: any) => {
    try {
      console.log('Creando nueva cancha:', canchaData);
      
      // Si no hay complejo ID, usar uno por defecto o el primero disponible
      if (!complejoId) {
        console.warn('No se proporcionó complejo_id, usando el primer complejo disponible');
        // Obtener el primer complejo
        const complejoResponse = await fetch('http://localhost:3000/api/complejos');
        const complejos = await complejoResponse.json();
        if (complejos.length === 0) {
          alert('No hay complejos disponibles. Crea un complejo primero.');
          return;
        }
        // Usar el primer complejo
        const primerComplejo = complejos[0].id;
        await crearCancha(primerComplejo, canchaData);
      } else {
        await crearCancha(complejoId, canchaData);
      }
      
      setIsCanchaFormOpen(false);
      setRefreshKey(prev => prev + 1); // Trigger refresh
      alert('¡Cancha creada exitosamente!');
    } catch (error) {
      console.error('Error al crear cancha:', error);
      alert('Error al crear la cancha. Por favor, intenta nuevamente.');
    }
  };

  const crearCancha = async (complejo_id: string, canchaData: any) => {
    const response = await fetch(`http://localhost:3000/api/complejos/${complejo_id}/canchas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(canchaData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear la cancha');
    }

    return await response.json();
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
          complejoId={complejoId}
          key={refreshKey}
        />
      </div>

      {/* Modal del formulario de cancha */}
      <CanchaForm
        isOpen={isCanchaFormOpen}
        onClose={handleCloseCanchaForm}
        onSubmit={handleSubmitCancha}
      />
    </div>
  );
};

export default GestorPlano;
