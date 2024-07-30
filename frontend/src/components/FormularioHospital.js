// src/components/FormularioHospital.js

import React, { useState, useEffect } from 'react';
import './Hospitales.css';

const FormularioHospital = ({ modo, hospitalInicial, onSubmit, onCancel }) => {
  const [nombre, setNombre] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (modo === 'editar' && hospitalInicial) {
      setNombre(hospitalInicial.nombre_hospital);
      setCiudad(hospitalInicial.ciudad_hospital);
    }
  }, [modo, hospitalInicial]);

  const validarNombreHospital = (nombre) => {
    const nombreRegex = /^[a-zA-Z][a-zA-Z0-9\s#]*$/;
    if (!nombre) {
      return 'El nombre del hospital es obligatorio';
    } else if (!nombreRegex.test(nombre)) {
      return 'El nombre del hospital debe comenzar con letras y puede incluir números y espacios';
    } else if (nombre.length < 2 || nombre.length > 100) {
      return 'El nombre del hospital debe tener entre 2 y 100 caracteres';
    }
    return null;
  };

  const validarCiudadHospital = (ciudad) => {
    const ciudadRegex = /^[a-zA-Z][a-zA-Z0-9\s#,.]*$/;
    if (!ciudad) {
      return 'La ciudad del hospital es obligatoria';
    } else if (!ciudadRegex.test(ciudad)) {
      return 'La ciudad del hospital debe comenzar con letras y puede incluir números y espacios';
    } else if (ciudad.length < 2 || ciudad.length > 100) {
      return 'La ciudad del hospital debe tener entre 2 y 100 caracteres';
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorNombre = validarNombreHospital(nombre);
    if (errorNombre) {
      setError(errorNombre);
      return;
    }

    const errorCiudad = validarCiudadHospital(ciudad);
    if (errorCiudad) {
      setError(errorCiudad);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const hospital = {
      id_hospital: hospitalInicial ? hospitalInicial.id_hospital : undefined,
      nombre_hospital: nombre,
      ciudad_hospital: ciudad,
    };

    try {
      await onSubmit(hospital);
      setNombre('');
      setCiudad('');
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setError('Error al enviar el formulario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="formulario-hospital-container">
      <h2 className="titulo-formulario">{modo === 'crear' ? 'Capturar Nuevo Hospital' : 'Editar Hospital'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Hospital:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="ciudad">Ciudad del Hospital:</label>
          <input
            type="text"
            id="ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="boton-crear" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : (modo === 'crear' ? 'Crear Hospital' : 'Actualizar Hospital')}
          </button>
          <button type="button" className="boton-cancelar" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default FormularioHospital;
