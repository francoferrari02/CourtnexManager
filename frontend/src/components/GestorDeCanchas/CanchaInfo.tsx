import React, { useState, useEffect } from 'react';
import './css/CanchaInfo.css';

interface CanchaInfoProps {
  isOpen: boolean;
  cancha: any;
  onClose: () => void;
  onUpdate: (canchaId: string, updatedData: any) => void;
}

const CanchaInfo: React.FC<CanchaInfoProps> = ({
  isOpen,
  cancha,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo_deporte: '',
    dimensiones: {
      largo: 0,
      ancho: 0,
      unidad: 'metros',
      superficie: ''
    },
    precio_hora: 0,
    iluminacion: false,
    techada: false,
    estado: 'disponible'
  });

  useEffect(() => {
    if (cancha) {
      setFormData({
        nombre: cancha.nombre || '',
        tipo_deporte: cancha.tipo_deporte || '',
        dimensiones: {
          largo: cancha.dimensiones?.largo || 0,
          ancho: cancha.dimensiones?.ancho || 0,
          unidad: cancha.dimensiones?.unidad || 'metros',
          superficie: cancha.dimensiones?.superficie || ''
        },
        precio_hora: cancha.precio_hora || 0,
        iluminacion: cancha.iluminacion || false,
        techada: cancha.techada || false,
        estado: cancha.estado || 'disponible'
      });
    }
  }, [cancha]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'dimensiones') {
        setFormData(prev => ({
          ...prev,
          dimensiones: {
            ...prev.dimensiones,
            [child]: type === 'number' ? parseFloat(value) || 0 : value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(cancha.id, formData);
  };

  if (!isOpen) return null;

  return (
    <div className="cancha-info-overlay">
      <div className="cancha-info-modal">
        <div className="cancha-info-header">
          <h2>Editar Cancha</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="cancha-info-form">
          <div className="form-section">
            <h3>Información Básica</h3>
            
            <div className="form-group">
              <label htmlFor="nombre">Nombre de la Cancha</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipo_deporte">Tipo de Deporte</label>
              <select
                id="tipo_deporte"
                name="tipo_deporte"
                value={formData.tipo_deporte}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar deporte</option>
                <option value="futbol">Fútbol</option>
                <option value="futbol_5">Fútbol 5</option>
                <option value="futbol_7">Fútbol 7</option>
                <option value="futbol_11">Fútbol 11</option>
                <option value="tenis">Tenis</option>
                <option value="padel">Pádel</option>
                <option value="basquet">Básquet</option>
                <option value="voley">Vóley</option>
                <option value="hockey">Hockey</option>
                <option value="multiuso">Multiuso</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
              >
                <option value="disponible">Disponible</option>
                <option value="ocupada">Ocupada</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="fuera_servicio">Fuera de Servicio</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Dimensiones</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dimensiones.largo">Largo</label>
                <input
                  type="number"
                  id="dimensiones.largo"
                  name="dimensiones.largo"
                  value={formData.dimensiones.largo}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dimensiones.ancho">Ancho</label>
                <input
                  type="number"
                  id="dimensiones.ancho"
                  name="dimensiones.ancho"
                  value={formData.dimensiones.ancho}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dimensiones.unidad">Unidad</label>
                <select
                  id="dimensiones.unidad"
                  name="dimensiones.unidad"
                  value={formData.dimensiones.unidad}
                  onChange={handleChange}
                >
                  <option value="metros">Metros</option>
                  <option value="pies">Pies</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="dimensiones.superficie">Superficie</label>
              <input
                type="text"
                id="dimensiones.superficie"
                name="dimensiones.superficie"
                value={formData.dimensiones.superficie}
                onChange={handleChange}
                placeholder="Ej: Césped sintético, Cemento, etc."
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Características</h3>
            
            <div className="form-group">
              <label htmlFor="precio_hora">Precio por Hora ($)</label>
              <input
                type="number"
                id="precio_hora"
                name="precio_hora"
                value={formData.precio_hora}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="iluminacion"
                    checked={formData.iluminacion}
                    onChange={handleChange}
                  />
                  Iluminación
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="techada"
                    checked={formData.techada}
                    onChange={handleChange}
                  />
                  Techada
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="save-button">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CanchaInfo;
