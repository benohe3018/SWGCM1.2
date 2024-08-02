import React, { useState } from 'react';
import './FormularioDiagnostico.css';

const FormularioDiagnostico = ({ modo, diagnostico, onSubmit, onCancel }) => {
  const [nombreDiagnostico, setNombreDiagnostico] = useState(diagnostico ? diagnostico.nombre_diagnostico : '');

  const validarNombreDiagnostico = (nombre) => {
    const regex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*$/;
    return regex.test(nombre);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarNombreDiagnostico(nombreDiagnostico)) {
      alert('El nombre del diagnóstico no es válido');
      return;
    }
    onSubmit({ nombre_diagnostico: nombreDiagnostico });
  };

  return (
    <div className="formulario-diagnostico-container">
      <h2 className="titulo-formulario">{modo === 'crear' ? 'Capturar Nuevo Diagnóstico' : 'Editar Diagnóstico'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre_diagnostico">Nombre del Diagnóstico:</label>
          <input
            type="text"
            id="nombre_diagnostico"
            value={nombreDiagnostico}
            onChange={(e) => setNombreDiagnostico(e.target.value)}
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

export default FormularioDiagnostico;
