import React, { useState } from 'react';
import './css/CanchaForm.css';

interface CanchaFormData {
  nombre: string;
  tipo: string;
  ancho: number;
  largo: number;
  superficie: string;
  iluminacion: boolean;
  techada: boolean;
  precio_hora: number;
  activa: boolean;
  observaciones: string;
}

interface CanchaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CanchaFormData) => void;
}

const CanchaForm: React.FC<CanchaFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<CanchaFormData>({
    nombre: '',
    tipo: 'futbol',
    ancho: 20,
    largo: 40,
    superficie: 'cesped_sintetico',
    iluminacion: false,
    techada: false,
    precio_hora: 0,
    activa: true,
    observaciones: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CanchaFormData, string>>>({});

  const tiposCancha = [
    { value: 'futbol', label: '⚽ Fútbol' },
    { value: 'futbol_5', label: '🥅 Fútbol 5' },
    { value: 'futbol_7', label: '🏟️ Fútbol 7' },
    { value: 'futbol_11', label: '🏟️ Fútbol 11' },
    { value: 'tenis', label: '🎾 Tenis' },
    { value: 'padel', label: '🏓 Pádel' },
    { value: 'basquet', label: '🏀 Básquet' },
    { value: 'voley', label: '🏐 Vóley' },
    { value: 'hockey', label: '🏑 Hockey' },
    { value: 'multiuso', label: '🏟️ Multiuso' }
  ];

  const tiposSuperficie = [
    { value: 'cesped_natural', label: '🌱 Césped Natural' },
    { value: 'cesped_sintetico', label: '🌿 Césped Sintético' },
    { value: 'cemento', label: '🏗️ Cemento' },
    { value: 'parquet', label: '🪵 Parquet' },
    { value: 'sintetico', label: '🔷 Sintético' },
    { value: 'tierra_batida', label: '🏔️ Tierra Batida' },
    { value: 'tartán', label: '🏃 Tartán' }
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : type === 'number' 
          ? parseFloat(value) || 0
          : value
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name as keyof CanchaFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CanchaFormData, string>> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (formData.ancho <= 0) {
      newErrors.ancho = 'El ancho debe ser mayor a 0';
    }

    if (formData.largo <= 0) {
      newErrors.largo = 'El largo debe ser mayor a 0';
    }

    if (formData.precio_hora < 0) {
      newErrors.precio_hora = 'El precio no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        nombre: '',
        tipo: 'futbol',
        ancho: 20,
        largo: 40,
        superficie: 'cesped_sintetico',
        iluminacion: false,
        techada: false,
        precio_hora: 0,
        activa: true,
        observaciones: ''
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="cancha-form-overlay" onClick={handleClose}>
      <div className="cancha-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="cancha-form-header">
          <h2>
            <span className="form-icon">🏟️</span>
            Agregar Nueva Cancha
          </h2>
          <button 
            className="close-button"
            onClick={handleClose}
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form className="cancha-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Información básica */}
            <div className="form-section">
              <h3>📋 Información Básica</h3>
              
              <div className="form-group">
                <label htmlFor="nombre">Nombre de la Cancha *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Cancha 1, Cancha Principal..."
                  className={errors.nombre ? 'error' : ''}
                />
                {errors.nombre && <span className="error-text">{errors.nombre}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="tipo">Tipo de Cancha</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                >
                  {tiposCancha.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dimensiones */}
            <div className="form-section">
              <h3>📐 Dimensiones</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ancho">Ancho (metros) *</label>
                  <input
                    type="number"
                    id="ancho"
                    name="ancho"
                    value={formData.ancho}
                    onChange={handleInputChange}
                    min="1"
                    step="0.1"
                    className={errors.ancho ? 'error' : ''}
                  />
                  {errors.ancho && <span className="error-text">{errors.ancho}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="largo">Largo (metros) *</label>
                  <input
                    type="number"
                    id="largo"
                    name="largo"
                    value={formData.largo}
                    onChange={handleInputChange}
                    min="1"
                    step="0.1"
                    className={errors.largo ? 'error' : ''}
                  />
                  {errors.largo && <span className="error-text">{errors.largo}</span>}
                </div>
              </div>
            </div>

            {/* Características */}
            <div className="form-section">
              <h3>⚙️ Características</h3>
              
              <div className="form-group">
                <label htmlFor="superficie">Tipo de Superficie</label>
                <select
                  id="superficie"
                  name="superficie"
                  value={formData.superficie}
                  onChange={handleInputChange}
                >
                  {tiposSuperficie.map(superficie => (
                    <option key={superficie.value} value={superficie.value}>
                      {superficie.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-checkboxes">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="iluminacion"
                    name="iluminacion"
                    checked={formData.iluminacion}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="iluminacion">💡 Iluminación</label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="techada"
                    name="techada"
                    checked={formData.techada}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="techada">🏠 Techada</label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="activa"
                    name="activa"
                    checked={formData.activa}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="activa">✅ Activa</label>
                </div>
              </div>
            </div>

            {/* Precio */}
            <div className="form-section">
              <h3>💰 Precio</h3>
              
              <div className="form-group">
                <label htmlFor="precio_hora">Precio por Hora ($)</label>
                <input
                  type="number"
                  id="precio_hora"
                  name="precio_hora"
                  value={formData.precio_hora}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={errors.precio_hora ? 'error' : ''}
                />
                {errors.precio_hora && <span className="error-text">{errors.precio_hora}</span>}
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="form-section full-width">
            <h3>📝 Observaciones</h3>
            <div className="form-group">
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                placeholder="Información adicional sobre la cancha..."
                rows={3}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-submit"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"></path>
              </svg>
              Crear Cancha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CanchaForm;
