import React, { useState, useEffect } from 'react';
import './FormularioEspecialidad.css';

const FormularioEspecialidad = ({ modo, especialidad, onSubmit, onCancel, mensaje, error }) => {
  const [nombreEspecialidad, setNombreEspecialidad] = useState(especialidad ? especialidad.nombre_especialidad : '');

  // Este efecto se asegura de que el campo se vacíe cuando se cambia a modo "crear"
  useEffect(() => {
    if (modo === 'crear') {
      setNombreEspecialidad('');
    }
  }, [mensaje]);

  // Función de validación utilizando una expresión regular
  const validarNombreEspecialidad = (nombre) => {
    const regex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*$/;
    return regex.test(nombre);
  };

  // Función que maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombreEspecialidad) {
      alert('El nombre de la especialidad es obligatorio');
      return;
    }
    if (!validarNombreEspecialidad(nombreEspecialidad)) {
      alert('El nombre de la especialidad no es válido');
      return;
    }
    onSubmit({ nombre_especialidad: nombreEspecialidad });
  };

  // Función que maneja los cambios en el campo de entrada
  const handleChange = (e) => {
    setNombreEspecialidad(e.target.value);
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
