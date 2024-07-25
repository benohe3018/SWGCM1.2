import React, { useState, useEffect } from 'react';
import './FormularioEstudio.css';

const FormularioEstudio = ({ modo, estudioInicial, onSubmit, onCancel }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidNombre = (nombre) => {
    return typeof nombre === 'string' && nombre.length >= 2 && nombre.length <= 100;
  };
  
  const isValidDescripcion = (descripcion) => {
    return typeof descripcion === 'string' && descripcion.length <= 500;
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
        alert('Por favor, introduce un nombre de estudio válido, solo letras.');
        return;
    }
    if (!isValidDescripcion(descripcion)) {
        alert('Por favor, introduce una descripción válida, solo letras.');
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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nombre">Nombre del Estudio:</label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
};

export default FormularioEstudio;


