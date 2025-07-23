import React from 'react';
import './BotonEditar.css';

interface BotonEditarProps {
  onClick?: () => void;
  disabled?: boolean;
}

const BotonEditar: React.FC<BotonEditarProps> = ({
  onClick,
  disabled = false
}) => {
  return (
    <button
      className={`boton-editar ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title="Editar canchas existentes"
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
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="m18.5 2.5 a2.12 2.12 0 0 1 3 3l-9.5 9.5-4 1 1-4z"></path>
      </svg>
      <span className="boton-text">Editar</span>
    </button>
  );
};

export default BotonEditar;
