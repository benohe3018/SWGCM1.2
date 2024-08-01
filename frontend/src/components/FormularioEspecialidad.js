import React, { useState, useEffect } from 'react';
import './FormularioEspecialidad.css';

const FormularioEspecialidad = ({ modo, especialidad, onSubmit, onCancel, mensaje, error }) => {
  const [nombreEspecialidad, setNombreEspecialidad] = useState(especialidad ? especialidad.nombre_especialidad : '');
  const [formError, alert] = useState('');

  useEffect(() => {
    if (modo === 'crear') {
      setNombreEspecialidad('');
    }
  }, [mensaje]);

  const validarNombreEspecialidad = (nombre) => {
    const regex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*$/;
    return regex.test(nombre);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombreEspecialidad) {
      alert('El nombre de la especialidad es obligatorio');
      return;
    }
    if (!validarNombreEspecialidad(nombreEspecialidad)) {
      alert('El nombre de la especialidad no es válido, ejemplo, capture "Cirugía"');
      return;
    }
    onSubmit({ nombre_especialidad: nombreEspecialidad });
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (validarNombreEspecialidad(value) || value === '') {
      setNombreEspecialidad(value);
      alert('');
    } else {
      alert('El nombre de la especialidad no es válido');
    }
  };

  return (
    <div className="formulario-especialidad-container">
      <h2 className="titulo-formulario">{modo === 'crear' ? 'Capturar Nueva Especialidad' : 'Editar Especialidad'}</h2>
      {mensaje && <div className="mensaje-exitoso">{mensaje}</div>}
      {error && <div className="mensaje-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre_especialidad">Nombre de la Especialidad:</label>
          <input
            type="text"
            id="nombre_especialidad"
            value={nombreEspecialidad}
            onChange={handleChange}
            required
          />
          {formError && <div className="mensaje-error">{formError}</div>}
        </div>
        <div className="form-actions">
          <button type="submit" className="crear-button">{modo === 'crear' ? 'Crear' : 'Guardar'}</button>
          <button type="button" className="cancel-button" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default FormularioEspecialidad;
