// src/components/UnidadesMedicinaFamiliar.js

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UnidadesMedicinaFamiliar.css'; 
import { getUnidades, createUnidad, updateUnidad, deleteUnidad } from './unidadesMedicinaFamiliarService';
import FormularioUnidad from './FormularioUnidad';
import ModalConfirmacion from './ModalConfirmacion';
import logoIMSS from '../images/LogoIMSS.jpg';
import mrMachine from '../images/MRMachine.jpg';

const UnidadesMedicinaFamiliar = ({ vistaInicial }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [unidades, setUnidades] = useState([]);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [vista, setVista] = useState(vistaInicial || 'ver');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('nombre_unidad_medica');
  const unidadesPerPage = 10;

  useEffect(() => {
    if (location.pathname === '/crear-unidad') {
      setVista('crear');
    } else if (location.pathname === '/ver-unidades') {
      setVista('ver');
    } else if (location.pathname === '/update-unidad') {
      setVista('editar');
    } else if (location.pathname === '/delete-unidad') {
      setVista('eliminar');
    }
  }, [location.pathname]);

  const inicializarUnidades = useCallback(async () => {
    try {
      setCargando(true);
      const data = await getUnidades();
      data.sort((a, b) => a.id_unidad_medica - b.id_unidad_medica);
      setUnidades(data);
      setError(null);
    } catch (error) {
      console.error("Error al inicializar unidades:", error);
      setError("Hubo un problema al cargar las unidades. Por favor, intente de nuevo.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    inicializarUnidades();
  }, [inicializarUnidades]);

  const cargarUnidades = async () => {
    try {
      setCargando(true);
      const data = await getUnidades();
      data.sort((a, b) => a.id_unidad_medica - b.id_unidad_medica);
      setUnidades(data);
      setError(null);
    } catch (error) {
      console.error("Error al cargar unidades:", error);
      setError("Hubo un problema al cargar las unidades. Por favor, intente de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const validarNombreUnidad = (nombre) => {
    const nombreRegex = /^[a-zA-Z][a-zA-Z0-9\s#]*$/;
    if (!nombre) {
      return 'El nombre de la unidad es obligatorio';
    } else if (!nombreRegex.test(nombre)) {
      return 'El nombre de la unidad debe comenzar con letras y puede incluir números y espacios';
    } else if (nombre.length < 2 || nombre.length > 100) {
      return 'El nombre de la unidad debe tener entre 2 y 100 caracteres';
    }
    return null;
  };

  const validarDescripcionUnidad = (descripcion) => {
    const descripcionRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ][a-zA-Z0-9\s#,.]*$/;
    if (!descripcion) {
      return 'La descripción de la unidad es obligatoria';
    } else if (!descripcionRegex.test(descripcion)) {
      return 'La descripción de la unidad debe comenzar con letras y puede incluir números y espacios';
    } else if (descripcion.length < 2 || descripcion.length > 100) {
      return 'La descripción de la unidad debe tener entre 2 y 100 caracteres';
    }
    return null;
  };

  const handleCrearUnidad = async (nuevaUnidad) => {
    const errorNombre = validarNombreUnidad(nuevaUnidad.nombre_unidad_medica);
    if (errorNombre) {
      alert(errorNombre);
      return;
    }
  
    const errorDescripcion = validarDescripcionUnidad(nuevaUnidad.direccion_unidad_medica);
    if (errorDescripcion) {
      alert(errorDescripcion);
      return;
    }
  
    try {
      const unidadCreada = await createUnidad(nuevaUnidad);
      setUnidades([...unidades, unidadCreada]); // Agregar la nueva unidad al estado
      setMensaje('Unidad creada exitosamente.');
      setTimeout(() => {
        setMensaje(null);
      }, 3000); // Mostrar el mensaje por 3 segundos
    } catch (error) {
      console.error("Error al crear unidad:", error);
      setError("No se pudo crear la unidad. Por favor, intente de nuevo.");
    }
  };

  const handleEditarUnidad = async (unidadEditada) => {
    const errorNombre = validarNombreUnidad(unidadEditada.nombre_unidad_medica);
    if (errorNombre) {
      alert(errorNombre);
      return;
    }
  
    const errorDescripcion = validarDescripcionUnidad(unidadEditada.direccion_unidad_medica);
    if (errorDescripcion) {
      alert(errorDescripcion);
      return;
    }
  
    try {
      if (!unidadEditada.id_unidad_medica) {
        throw new Error("El ID de la unidad no está definido");
      }
      const unidadActualizada = await updateUnidad(unidadEditada.id_unidad_medica, unidadEditada);
      setUnidades(unidades.map((unidad) =>
        unidad.id_unidad_medica === unidadActualizada.id_unidad_medica ? unidadActualizada : unidad
      )); // Actualizar la unidad en el estado
      setUnidadSeleccionada(null);
      setMensaje('Unidad actualizada exitosamente.');
      setTimeout(() => setMensaje(null), 3000); // Mostrar el mensaje por 3 segundos
    } catch (error) {
      console.error("Error al editar unidad:", error);
      setError("No se pudo editar la unidad. Por favor, intente de nuevo.");
    }
  };
  

  const handleEliminarUnidad = (id) => {
    const unidad = unidades.find(u => u.id_unidad_medica === id);
    if (unidad) {
      setUnidadSeleccionada(unidad);
      setMostrarModal(true);
    }
  };

  const confirmarEliminarUnidad = async () => {
    try {
      await deleteUnidad(unidadSeleccionada.id_unidad_medica);
      await cargarUnidades();
      setMostrarModal(false);
      setUnidadSeleccionada(null);
      setMensaje('Unidad eliminada exitosamente.');
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      console.error("Error al eliminar unidad:", error);
      setError("No se pudo eliminar la unidad. Por favor, intente de nuevo.");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFieldChange = (event) => {
    setSearchField(event.target.value);
  };

  const filteredUnidades = unidades.filter((unidad) => {
    if (searchField === 'nombre_unidad_medica') {
      return unidad.nombre_unidad_medica.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchField === 'direccion_unidad_medica') {
      return unidad.direccion_unidad_medica.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return unidad;
  });

  const indexOfLastUnidad = currentPage * unidadesPerPage;
  const indexOfFirstUnidad = indexOfLastUnidad - unidadesPerPage;
  const currentUnidades = filteredUnidades.slice(indexOfFirstUnidad, indexOfLastUnidad);

  const totalPages = Math.ceil(filteredUnidades.length / unidadesPerPage);

  if (cargando) {
    return <div>Cargando unidades...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="unidades-medicina-familiar-page">
      <header className="unidades-medicina-familiar-header">
        <img src={logoIMSS} alt="Logo IMSS" className="umf-header-logo" />
        <div className="umf-header-texts">
          <h1 className="umf-welcome-message">Sistema de Gestión de Unidades de Medicina Familiar</h1>
          <h2 className="umf-department-name">Departamento de Resonancia Magnética - HGR #46</h2>
        </div>
      </header>
      {vista === '' && <img src={mrMachine} alt="Máquina de resonancia magnética" className="mr-machine" />}
      <div className="unidades-medicina-familiar-content">
        {mensaje && <div className="mensaje-confirmacion">{mensaje}</div>}
        {vista === 'crear' && (
          <FormularioUnidad
            modo="crear"
            onSubmit={handleCrearUnidad}
            onCancel={() => navigate('/ver-unidades')}
          />
        )}
        {vista === 'ver' && (
          <>
            <div className="busqueda-unidad">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <select value={searchField} onChange={handleFieldChange}>
                <option value="nombre_unidad_medica">Nombre de la Unidad</option>
                <option value="direccion_unidad_medica">Dirección de la Unidad</option>
              </select>
            </div>
            <div className="tabla-unidades-container">
              <table className="tabla-unidades">
                <thead>
                  <tr>
                    <th>Nombre de la Unidad</th>
                    <th>Dirección de la Unidad</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUnidades.map((unidad) => (
                    <tr key={unidad.id_unidad_medica}>
                      <td>{unidad.nombre_unidad_medica}</td>
                      <td>{unidad.direccion_unidad_medica}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination-read-usuario">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage ? 'active' : ''}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        {vista === 'editar' && (
          <>
            <div className="busqueda-unidad">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <select value={searchField} onChange={handleFieldChange}>
                <option value="nombre_unidad_medica">Nombre de la Unidad</option>
                <option value="direccion_unidad_medica">Dirección de la Unidad</option>
              </select>
            </div>
            <div className="tabla-unidades-container">
              <table className="tabla-unidades">
                <thead>
                  <tr>
                    <th>Nombre de la Unidad</th>
                    <th>Dirección de la Unidad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUnidades.map((unidad) => (
                    <tr key={unidad.id_unidad_medica}>
                      <td>
                        <input
                          type="text"
                          value={unidad.nombre_unidad_medica}
                          onChange={(e) => {
                            const nuevasUnidades = unidades.map((u) =>
                              u.id_unidad_medica === unidad.id_unidad_medica
                                ? { ...u, nombre_unidad_medica: e.target.value }
                                : u
                            );
                            setUnidades(nuevasUnidades);
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={unidad.direccion_unidad_medica}
                          onChange={(e) => {
                            const nuevasUnidades = unidades.map((u) =>
                              u.id_unidad_medica === unidad.id_unidad_medica
                                ? { ...u, direccion_unidad_medica: e.target.value }
                                : u
                            );
                            setUnidades(nuevasUnidades);
                          }}
                        />
                      </td>
                      <td>
                        <div className="botones-acciones">
                          <button
                            onClick={() => handleEditarUnidad(unidad)}
                            className="guardar-button"
                          >
                            Guardar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination-read-usuario">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage ? 'active' : ''}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        {vista === 'eliminar' && (
          <>
            <div className="busqueda-unidad">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <select value={searchField} onChange={handleFieldChange}>
                <option value="nombre_unidad_medica">Nombre de la Unidad</option>
                <option value="direccion_unidad_medica">Dirección de la Unidad</option>
              </select>
            </div>
            <div className="tabla-unidades-container">
              <table className="tabla-unidades">
                <thead>
                  <tr>
                    <th>Nombre de la Unidad</th>
                    <th>Dirección de la Unidad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUnidades.map((unidad) => (
                    <tr key={unidad.id_unidad_medica}>
                      <td>{unidad.nombre_unidad_medica}</td>
                      <td>{unidad.direccion_unidad_medica}</td>
                      <td>
                        <div className="botones-acciones">
                          <button
                            onClick={() => handleEliminarUnidad(unidad.id_unidad_medica)}
                            className="eliminar-button"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination-read-usuario">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage ? 'active' : ''}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {mostrarModal && (
        <ModalConfirmacion
          mensaje="¿Estás seguro de que deseas eliminar esta unidad?"
          onConfirm={confirmarEliminarUnidad}
          onCancel={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
};

export default UnidadesMedicinaFamiliar;
