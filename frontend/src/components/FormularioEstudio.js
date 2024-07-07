import React, { useState, useEffect } from 'react';
import './FormularioEstudio.css';

const FormularioEstudio = ({ modo, estudioInicial, onSubmit, onCancel }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (modo === 'editar' && estudioInicial) {
      setNombre(estudioInicial.nombre_estudio);
      setDescripcion(estudioInicial.descripcion_estudio);
    }
  }, [modo, estudioInicial]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!isValidNombre(nombre)) {
      alert('Por favor, introduce un nombre de estudio válido (2-100 caracteres).');
      return;
    }
    if (!isValidDescripcion(descripcion)) {
      alert('Por favor, introduce una descripción válida (máximo 500 caracteres).');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        nombre_estudio: nombre,
        descripcion_estudio: descripcion,
      });
      setNombre('');
      setDescripcion('');
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidNombre = (nombre) => {
    return nombre.length >= 2 && nombre.length <= 100;
  };

  const isValidDescripcion = (descripcion) => {
    return descripcion.length <= 500;
  };

  return (
    <div className="formulario-estudio-container">
      <h2>{modo === 'crear' ? 'Crear Nuevo Estudio' : 'Editar Estudio'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Estudio:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del estudio"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción del estudio"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : (modo === 'crear' ? 'Crear Estudio' : 'Actualizar Estudio')}
          </button>
          <button type="button" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default FormularioEstudio;
