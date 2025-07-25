import React, { useState } from 'react';
import Plano from './Plano';
import CanchaForm from './CanchaForm';
import CanchaInfo from './CanchaInfo';
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
  const [isCanchaInfoOpen, setIsCanchaInfoOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [repositionMode, setRepositionMode] = useState<string | null>(null); // ID de la cancha en modo reposición
  const [selectedCanchaForEdit, setSelectedCanchaForEdit] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Handlers para los botones
  const handleAgregarCancha = () => {
    console.log('Agregar cancha clicked');
    setIsCanchaFormOpen(true);
  };

  const handleEditar = () => {
    console.log('Editar clicked');
    setIsEditMode(!isEditMode);
  };

  const handleFiltrar = () => {
    console.log('Filtrar clicked');
    // TODO: Implementar funcionalidad
  };

  const handleCloseCanchaForm = () => {
    setIsCanchaFormOpen(false);
  };

  const handleCloseCanchaInfo = () => {
    setIsCanchaInfoOpen(false);
    setSelectedCanchaForEdit(null);
  };

  const handleEditCancha = (cancha: any) => {
    setSelectedCanchaForEdit(cancha);
    setIsCanchaInfoOpen(true);
  };

  const handleDeleteCancha = async (cancha: any) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de eliminar "${cancha.nombre}"?\n\nTodas las reservas en esta cancha se eliminarán de la base de datos.`
    );
    
    if (confirmDelete) {
      try {
        await eliminarCancha(cancha.id);
        setRefreshKey(prev => prev + 1);
        alert('Cancha eliminada exitosamente');
      } catch (error) {
        console.error('Error al eliminar cancha:', error);
        alert('Error al eliminar la cancha. Por favor, intenta nuevamente.');
      }
    }
  };

  const handleRepositionCancha = (cancha: any) => {
    console.log('Activar modo reposición para:', cancha.nombre);
    setRepositionMode(cancha.id);
  };

  const handleCanchaPositionUpdate = async (canchaId: string, newPosition: any) => {
    try {
      console.log('Actualizando posición:', { canchaId, newPosition });
      
      // Obtener los datos actuales de la cancha
      const canchaActual = await obtenerCancha(canchaId);
      if (!canchaActual) {
        throw new Error('No se pudo obtener la información actual de la cancha');
      }
      
      // Actualizar solo las coordenadas, manteniendo el resto de datos
      const datosActualizados = {
        ...canchaActual,
        coordenadas_mapa: newPosition
      };
      
      await actualizarCancha(canchaId, datosActualizados);
      setRepositionMode(null); // Salir del modo reposición
      setRefreshKey(prev => prev + 1);
      console.log('Posición actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar posición de cancha:', error);
      alert('Error al actualizar la posición de la cancha.');
      setRepositionMode(null); // Salir del modo incluso si hay error
    }
  };

  const handleCancelReposition = () => {
    setRepositionMode(null);
  };

  const handleUpdateCancha = async (canchaId: string, updatedData: any) => {
    try {
      await actualizarCancha(canchaId, updatedData);
      setRefreshKey(prev => prev + 1);
      setIsCanchaInfoOpen(false);
      setSelectedCanchaForEdit(null);
      alert('Cancha actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar cancha:', error);
      alert('Error al actualizar la cancha. Por favor, intenta nuevamente.');
    }
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

  const eliminarCancha = async (canchaId: string) => {
    const response = await fetch(`http://localhost:3000/api/canchas/${canchaId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar la cancha');
    }

    return await response.json();
  };

  const obtenerCancha = async (canchaId: string) => {
    const response = await fetch(`http://localhost:3000/api/canchas/${canchaId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener la cancha');
    }

    return await response.json();
  };

  const actualizarCancha = async (canchaId: string, updatedData: any) => {
    const response = await fetch(`http://localhost:3000/api/canchas/${canchaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar la cancha');
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
            <BotonEditar onClick={handleEditar} isActive={isEditMode} />
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
          isEditMode={isEditMode}
          repositionMode={repositionMode}
          onEditCancha={handleEditCancha}
          onDeleteCancha={handleDeleteCancha}
          onRepositionCancha={handleRepositionCancha}
          onPositionUpdate={handleCanchaPositionUpdate}
          onCancelReposition={handleCancelReposition}
          key={refreshKey}
        />
      </div>

      {/* Modal del formulario de cancha */}
      <CanchaForm
        isOpen={isCanchaFormOpen}
        onClose={handleCloseCanchaForm}
        onSubmit={handleSubmitCancha}
      />

      {/* Modal de información/edición de cancha */}
      {selectedCanchaForEdit && (
        <CanchaInfo
          isOpen={isCanchaInfoOpen}
          cancha={selectedCanchaForEdit}
          onClose={handleCloseCanchaInfo}
          onUpdate={handleUpdateCancha}
        />
      )}
    </div>
  );
};

export default GestorPlano;
