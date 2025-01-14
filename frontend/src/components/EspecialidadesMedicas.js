import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './EspecialidadesMedicas.css'; 
import { getEspecialidades, createEspecialidad, updateEspecialidad, deleteEspecialidad } from './especialidadesService';
import FormularioEspecialidad from './FormularioEspecialidad';
import ModalConfirmacion from './ModalConfirmacion';
import logoIMSS from '../images/LogoIMSS.jpg';

const EspecialidadesMedicas = ({ vistaInicial }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [vista, setVista] = useState(vistaInicial || 'ver'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('nombre_especialidad');
  const especialidadesPerPage = 10;

  // Función para manejar cambios en los inputs
  const handleInputChange = (e, idEspecialidad, field) => {
    const newEspecialidades = [...especialidades];
    const index = newEspecialidades.findIndex(esp => esp.id === idEspecialidad);
    if (index !== -1) {
      newEspecialidades[index][field] = e.target.value;
      setEspecialidades(newEspecialidades);
    }
  };

  useEffect(() => {
    if (location.pathname === '/crear-especialidad') {
      setVista('crear');
    } else if (location.pathname === '/ver-especialidades') {
      setVista('ver');
    } else if (location.pathname === '/update-especialidad') {
      setVista('editar');
    } else if (location.pathname === '/delete-especialidad') {
      setVista('eliminar');
    }
  }, [location.pathname]);

  const inicializarEspecialidades = useCallback(async () => {
    try {
      setCargando(true);
      const data = await getEspecialidades();
      data.sort((a, b) => a.id - b.id);
      setEspecialidades(data);
      setError(null);
    } catch (error) {
      console.error("Error al inicializar especialidades:", error);
      setError("Hubo un problema al cargar las especialidades médicas. Por favor, intente de nuevo.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    inicializarEspecialidades();
  }, [inicializarEspecialidades]);

  const cargarEspecialidades = async () => {
    try {
      setCargando(true);
      const data = await getEspecialidades();
      data.sort((a, b) => a.id - b.id);
      setEspecialidades(data);
      setError(null);
    } catch (error) {
      console.error("Error al cargar especialidades:", error);
      setError("Hubo un problema al cargar las especialidades médicas. Por favor, intente de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const validarNombreEspecialidad = (nombre) => {
    const regex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*$/;
    return regex.test(nombre);
  };

  const handleCrearEspecialidad = async (nuevaEspecialidad) => {
    try {
      if (!nuevaEspecialidad.nombre_especialidad) {
        alert('El nombre de la especialidad es obligatorio');
        return;
      }
      if (!validarNombreEspecialidad(nuevaEspecialidad.nombre_especialidad)) {
        alert('El nombre de la especialidad no es válido');
        return;
      }
      await createEspecialidad(nuevaEspecialidad);
      setMensaje('Especialidad creada exitosamente.');
      await cargarEspecialidades();
      setTimeout(() => {
        setMensaje(null);
        setVista('crear');
      }, 3000); 
    } catch (error) {
      console.error("Error al crear especialidad:", error);
      setError("No se pudo crear la especialidad. Por favor, intente de nuevo.");
    }
  };

  const handleEditarEspecialidad = async (especialidadEditada) => {
    try {
      if (!especialidadEditada.id) {
        throw new Error("El ID de la especialidad no está definido");
      }
      if (!especialidadEditada.nombre_especialidad) {
        alert('El nombre de la especialidad es obligatorio');
        return;
      }
      if (!validarNombreEspecialidad(especialidadEditada.nombre_especialidad)) {
        alert('El nombre de la especialidad no es válido');
        return;
      }
      await updateEspecialidad(especialidadEditada.id, especialidadEditada);
      await cargarEspecialidades();
      setEspecialidadSeleccionada(null);
      setMensaje('Especialidad actualizada exitosamente.');
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      console.error("Error al editar especialidad:", error);
      setError("No se pudo editar la especialidad. Por favor, intente de nuevo.");
    }
  };

  const handleEliminarEspecialidad = (id) => {
    const especialidad = especialidades.find(e => e.id === id);
    if (especialidad) {
      setEspecialidadSeleccionada(especialidad);
      setMostrarModal(true);
    }
  };

  const confirmarEliminarEspecialidad = async () => {
    try {
      await deleteEspecialidad(especialidadSeleccionada.id);
      await cargarEspecialidades();
      setMostrarModal(false);
      setEspecialidadSeleccionada(null);
      setMensaje('Especialidad eliminada exitosamente.');
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      console.error("Error al eliminar especialidad:", error);
      setError("No se pudo eliminar la especialidad. Por favor, intente de nuevo.");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFieldChange = (event) => {
    setSearchField(event.target.value);
  };

  const filteredEspecialidades = especialidades.filter((especialidad) => {
    if (searchField === 'nombre_especialidad') {
      return especialidad.nombre_especialidad.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return especialidad;
  });

  const indexOfLastEspecialidad = currentPage * especialidadesPerPage;
  const indexOfFirstEspecialidad = indexOfLastEspecialidad - especialidadesPerPage;
  const currentEspecialidades = filteredEspecialidades.slice(indexOfFirstEspecialidad, indexOfLastEspecialidad);

  const totalPages = Math.ceil(filteredEspecialidades.length / especialidadesPerPage);

  if (cargando) {
    return <div>Cargando especialidades...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="especialidades-medicas">
      <header className="especialidades-medicas__header">
        <img src={logoIMSS} alt="Logo IMSS" className="especialidades-medicas__header-logo" />
        <div className="especialidades-medicas__header-texts">
          <h1 className="especialidades-medicas__welcome-message">Sistema de Gestión de Especialidades Médicas</h1>
          <h2 className="especialidades-medicas__department-name">Departamento de Resonancia Magnética - HGR #46</h2>
        </div>
      </header>
      <div className="especialidades-medicas__content">
        {mensaje && <div className="especialidades-medicas__message-confirmation">{mensaje}</div>}

        {vista === 'crear' && (
          <FormularioEspecialidad
            modo="crear"
            onSubmit={handleCrearEspecialidad}
            onCancel={() => navigate('/ver-especialidades')}
          />
        )}

        {vista === 'ver' && (
          <>
            <div className="especialidades-medicas__search-container">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
                className="especialidades-medicas__search-input"
              />
              <select
                value={searchField}
                onChange={handleFieldChange}
                className="especialidades-medicas__search-select"
              >
                <option value="nombre_especialidad">Nombre de la Especialidad</option>
              </select>
            </div>
            <div className="especialidades-medicas__table-container">
              <table className="especialidades-medicas__table">
                <thead>
                  <tr>
                    <th className="especialidades-medicas__table-header">Nombre de la Especialidad</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEspecialidades.map((especialidad) => (
                    <tr key={especialidad.id} className="especialidades-medicas__table-row">
                      <td className="especialidades-medicas__table-data">{especialidad.nombre_especialidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="especialidades-medicas__pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`especialidades-medicas__pagination-button ${page === currentPage ? 'active' : ''}`}
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
            <div className="especialidades-medicas__search-container">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
                className="especialidades-medicas__search-input"
              />
              <select
                value={searchField}
                onChange={handleFieldChange}
                className="especialidades-medicas__search-select"
              >
                <option value="nombre_especialidad">Nombre de la Especialidad</option>
              </select>
            </div>
            <div className="especialidades-medicas__table-container">
              <table className="especialidades-medicas__table">
                <thead>
                  <tr>
                    <th className="especialidades-medicas__table-header">Nombre de la Especialidad</th>
                    <th className="especialidades-medicas__table-header">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEspecialidades.map((especialidad) => (
                    <tr key={especialidad.id} className="especialidades-medicas__table-row">
                      <td className="especialidades-medicas__table-data">
                        <input
                          type="text"
                          value={especialidad.nombre_especialidad}
                          onChange={(e) => handleInputChange(e, especialidad.id, 'nombre_especialidad')}
                          className="especialidades-medicas__input"
                        />
                      </td>
                      <td className="especialidades-medicas__table-data">
                        <div className="especialidades-medicas__actions">
                          <button
                            onClick={() => handleEditarEspecialidad(especialidad)}
                            className="especialidades-medicas__button especialidades-medicas__button--guardar"
                          >
                            Guardar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="especialidades-medicas__pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`especialidades-medicas__pagination-button ${page === currentPage ? 'active' : ''}`}
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
            <div className="especialidades-medicas__search-container">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
                className="especialidades-medicas__search-input"
              />
              <select
                value={searchField}
                onChange={handleFieldChange}
                className="especialidades-medicas__search-select"
              >
                <option value="nombre_especialidad">Nombre de la Especialidad</option>
              </select>
            </div>
            <div className="especialidades-medicas__table-container">
              <table className="especialidades-medicas__table">
                <thead>
                  <tr>
                    <th className="especialidades-medicas__table-header">Nombre de la Especialidad</th>
                    <th className="especialidades-medicas__table-header">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEspecialidades.map((especialidad) => (
                    <tr key={especialidad.id} className="especialidades-medicas__table-row">
                      <td className="especialidades-medicas__table-data">{especialidad.nombre_especialidad}</td>
                      <td className="especialidades-medicas__table-data">
                        <div className="especialidades-medicas__actions">
                          <button
                            onClick={() => handleEliminarEspecialidad(especialidad.id)}
                            className="especialidades-medicas__button especialidades-medicas__button--eliminar"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="especialidades-medicas__pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`especialidades-medicas__pagination-button ${page === currentPage ? 'active' : ''}`}
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
          mensaje="¿Estás seguro de que deseas eliminar esta especialidad?"
          onConfirm={confirmarEliminarEspecialidad}
          onCancel={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
};


export default EspecialidadesMedicas;
