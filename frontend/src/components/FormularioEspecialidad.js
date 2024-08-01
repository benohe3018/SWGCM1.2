// src/components/FormularioEspecialidad.js

import React, { useState } from 'react';
import './FormularioEspecialidad.css';

const FormularioEspecialidad = ({ modo, especialidad, onSubmit, onCancel }) => {
  const [nombreEspecialidad, setNombreEspecialidad] = useState(especialidad ? especialidad.nombre_especialidad : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nombre_especialidad: nombreEspecialidad });
  };

  return (
    <div className="formulario-especialidad-container">
      <h2 className="titulo-formulario">{modo === 'crear' ? 'Capturar Nueva Especialidad' : 'Editar Especialidad'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre_especialidad">Nombre de la Especialidad:</label>
          <input
            type="text"
            id="nombre_especialidad"
            value={nombreEspecialidad}
            onChange={(e) => setNombreEspecialidad(e.target.value)}
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
