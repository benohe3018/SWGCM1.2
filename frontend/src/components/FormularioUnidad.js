import React, { useState, useEffect } from 'react';
import './UnidadesMedicinaFamiliar.css';

const FormularioUnidad = ({ modo, unidadInicial, onSubmit, onCancel }) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (modo === 'editar' && unidadInicial) {
      setNombre(unidadInicial.nombre_unidad_medica);
      setDireccion(unidadInicial.direccion_unidad_medica);
    }
  }, [modo, unidadInicial]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nombre || nombre.length < 2 || nombre.length > 100) {
      alert('Por favor, introduce un nombre válido (2-100 caracteres).');
      return;
    }
    if (!direccion || direccion.length < 2 || direccion.length > 100) {
      alert('Por favor, introduce una dirección válida (2-100 caracteres).');
      return;
    }

    setIsSubmitting(true);
    const unidad = {
      id_unidad_medica: unidadInicial ? unidadInicial.id_unidad_medica : undefined,
      nombre_unidad_medica: nombre,
      direccion_unidad_medica: direccion,
    };

    try {
      await onSubmit(unidad);
      setNombre('');
      setDireccion('');
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="formulario-unidad-container">
      <h2 className="titulo-formulario">{modo === 'crear' ? 'Crear Nueva Unidad' : 'Editar Unidad'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre de la Unidad:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="direccion">Dirección de la Unidad:</label>
          <input
            type="text"
            id="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="boton-crear" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : (modo === 'crear' ? 'Crear Unidad' : 'Actualizar Unidad')}
          </button>
          <button type="button" className="boton-cancelar" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default FormularioUnidad;

