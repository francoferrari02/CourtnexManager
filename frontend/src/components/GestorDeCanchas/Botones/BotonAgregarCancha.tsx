import React from 'react';
import './BotonAgregarCancha.css';

interface BotonAgregarCanchaProps {
  onClick?: () => void;
  disabled?: boolean;
}

const BotonAgregarCancha: React.FC<BotonAgregarCanchaProps> = ({
  onClick,
  disabled = false
}) => {
  return (
    <button
      className={`boton-agregar-cancha ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title="Agregar nueva cancha al plano"
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
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
      <span className="boton-text">Agregar Cancha</span>
    </button>
  );
};

export default BotonAgregarCancha;
