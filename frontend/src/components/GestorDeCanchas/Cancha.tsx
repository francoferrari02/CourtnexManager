import React from 'react';
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
}

const Cancha: React.FC<CanchaProps> = ({
  cancha,
  onClick,
  isSelected = false
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(cancha);
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

  // Calcular posición de la cancha (ajustar para el nombre externo)
  const position = cancha.coordenadas_mapa || { x: 100, y: 130 }; // +30px para compensar el nombre

  return (
    <div
      className={`cancha-component ${isSelected ? 'selected' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={handleClick}
      title={`${cancha.nombre} - ${cancha.tipo_deporte} - ${estadoInfo.text}`}
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
    </div>
  );
};

export default Cancha;
