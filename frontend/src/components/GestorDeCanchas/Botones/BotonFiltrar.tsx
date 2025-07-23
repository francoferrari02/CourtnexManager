import React from 'react';
import './BotonFiltrar.css';

interface BotonFiltrarProps {
  onClick?: () => void;
  disabled?: boolean;
  isActive?: boolean;
}

const BotonFiltrar: React.FC<BotonFiltrarProps> = ({
  onClick,
  disabled = false,
  isActive = false
}) => {
  return (
    <button
      className={`boton-filtrar ${disabled ? 'disabled' : ''} ${isActive ? 'active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title="Filtrar canchas por criterios"
    >
      <svg 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className="boton-icon"
      >
        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"></polygon>
      </svg>
      <span className="boton-text">Filtrar</span>
    </button>
  );
};

export default BotonFiltrar;
