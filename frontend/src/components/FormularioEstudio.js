import React, { useState, useEffect } from 'react';
import './FormularioEstudio.css';

const FormularioEstudio = ({ modo, estudioInicial, onSubmit, onCancel }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidNombre = (nombre) => {
    const regex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/;
    return typeof nombre === 'string' && nombre.length >= 2 && nombre.length <= 100 && regex.test(nombre);
  };
  
  const isValidDescripcion = (descripcion) => {
    const regex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/;
    return typeof descripcion === 'string' && descripcion.length <= 500 && regex.test(descripcion);
  };

  useEffect(() => {
    if (modo === 'editar' && estudioInicial) {
      setNombre(estudioInicial.nombre_estudio);
      setDescripcion(estudioInicial.descripcion_estudio);
    }
  }, [modo, estudioInicial]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!isValidNombre(nombre)) {
        alert('Por favor, introduce un nombre de estudio válido (2-100 caracteres, solo letras y espacios).');
        return;
    }
    if (!isValidDescripcion(descripcion)) {
        alert('Por favor, introduce una descripción válida (máximo 500 caracteres, solo letras y espacios).');
        return;
    }

    setIsSubmitting(true);
    const estudio = {
        id_estudio: estudioInicial ? estudioInicial.id_estudio : undefined, // Pasar el ID del estudio si existe
        nombre_estudio: nombre,
        descripcion_estudio: descripcion,
    };
    console.log("Datos enviados: ", estudio);

    try {
        await onSubmit(estudio);
        setNombre('');
        setDescripcion('');
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="formulario-estudio-container">
      <h2 className="titulo-formulario">{modo === 'crear' ? 'Crear Nuevo Estudio' : 'Editar Estudio'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Estudio:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del estudio (solo letras y espacios)"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción del Estudio:</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción del estudio (solo letras y espacios)"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="boton-crear" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : (modo === 'crear' ? 'Crear Estudio' : 'Actualizar Estudio')}
          </button>
          <button type="button" className="boton-cancelar" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default FormularioEstudio;



