// src/components/Hospitales.js

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Hospitales.css'; 
import { getHospitales, createHospital, updateHospital, deleteHospital } from './hospitalesService';
import FormularioHospital from './FormularioHospital';
import ModalConfirmacion from './ModalConfirmacion';
import logoIMSS from '../images/LogoIMSS.jpg';
import mrMachine from '../images/MRMachine.jpg';

const Hospitales = ({ vistaInicial }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hospitales, setHospitales] = useState([]);
  const [hospitalSeleccionado, setHospitalSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [vista, setVista] = useState(vistaInicial || 'ver');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('nombre_hospital');
  const hospitalesPerPage = 10;

  useEffect(() => {
    if (location.pathname === '/crear-hospital') {
      setVista('crear');
    } else if (location.pathname === '/ver-hospitales') {
      setVista('ver');
    } else if (location.pathname === '/update-hospital') {
      setVista('editar');
    } else if (location.pathname === '/delete-hospital') {
      setVista('eliminar');
    }
  }, [location.pathname]);

  const inicializarHospitales = useCallback(async () => {
    try {
      setCargando(true);
      const data = await getHospitales();
      data.sort((a, b) => a.id - b.id);
      setHospitales(data);
      setError(null);
    } catch (error) {
      console.error("Error al inicializar hospitales:", error);
      setError("Hubo un problema al cargar los hospitales. Por favor, intente de nuevo.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    inicializarHospitales();
  }, [inicializarHospitales]);

  const cargarHospitales = async () => {
    try {
      setCargando(true);
      const data = await getHospitales();
      data.sort((a, b) => a.id - b.id);
      setHospitales(data);
      setError(null);
    } catch (error) {
      console.error("Error al cargar hospitales:", error);
      setError("Hubo un problema al cargar los hospitales. Por favor, intente de nuevo.");
    } finally {
      setCargando(false);
    }
  };

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
    const ciudadRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ][a-zA-Z0-9\s#,.ñÑ]*$/;
    if (!ciudad) {
        return 'La ciudad del hospital es obligatoria';
    } else if (!ciudadRegex.test(ciudad)) {
        return 'La ciudad del hospital debe comenzar con letras y puede incluir números y espacios';
    } else if (ciudad.length < 2 || ciudad.length > 100) {
        return 'La ciudad del hospital debe tener entre 2 y 100 caracteres';
    }
    return null;
};
  
  const handleCrearHospital = async (nuevoHospital) => {
    console.log('Creating hospital:', nuevoHospital);

    const errorNombre = validarNombreHospital(nuevoHospital.nombre_hospital);
    if (errorNombre) {
      setError(errorNombre);
      return;
    }

    const errorCiudad = validarCiudadHospital(nuevoHospital.ciudad_hospital);
    if (errorCiudad) {
      setError(errorCiudad);
      return;
    }

    try {
      await createHospital(nuevoHospital);
      setMensaje('Hospital creado exitosamente.');
      await cargarHospitales(); // Recargar la lista después de crear el hospital
      setTimeout(() => {
        setMensaje(null);
      }, 3000); 
    } catch (error) {
      console.error("Error al crear hospital:", error);
      setError("No se pudo crear el hospital. Por favor, intente de nuevo.");
    }
  };

const handleEditarHospital = async (hospitalEditado) => {
    try {
      if (!hospitalEditado.id) {
        throw new Error("El ID del hospital no está definido");
      }
      await updateHospital(hospitalEditado.id, hospitalEditado);
      await cargarHospitales(); // Recargar la lista después de actualizar el hospital
      setHospitalSeleccionado(null);
      setMensaje('Hospital actualizado exitosamente.');
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      console.error("Error al editar hospital:", error);
      setError("No se pudo editar el hospital. Por favor, intente de nuevo.");
    }
  };

  const handleEliminarHospital = (id) => {
    const hospital = hospitales.find(h => h.id === id);
    if (hospital) {
      setHospitalSeleccionado(hospital);
      setMostrarModal(true);
    }
  };

  const confirmarEliminarHospital = async () => {
    try {
      await deleteHospital(hospitalSeleccionado.id);
      await cargarHospitales(); // Recargar la lista después de eliminar el hospital
      setMostrarModal(false);
      setHospitalSeleccionado(null);
      setMensaje('Hospital eliminado exitosamente.');
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      console.error("Error al eliminar hospital:", error);
      setError("No se pudo eliminar el hospital. Por favor, intente de nuevo.");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFieldChange = (event) => {
    setSearchField(event.target.value);
  };

  const filteredHospitales = hospitales.filter((hospital) => {
    if (searchField === 'nombre_hospital') {
      return hospital.nombre_hospital.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchField === 'ciudad_hospital') {
      return hospital.ciudad_hospital.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return hospital;
  });

  const indexOfLastHospital = currentPage * hospitalesPerPage;
  const indexOfFirstHospital = indexOfLastHospital - hospitalesPerPage;
  const currentHospitales = filteredHospitales.slice(indexOfFirstHospital, indexOfLastHospital);

  const totalPages = Math.ceil(filteredHospitales.length / hospitalesPerPage);

  if (cargando) {
    return <div>Cargando hospitales...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="hospitales">
      <header className="hospitales__header">
        <img src={logoIMSS} alt="Logo IMSS" className="hospitales__header-logo" />
        <div className="hospitales__header-texts">
          <h1 className="hospitales__welcome-message">Sistema de Gestión de Hospitales</h1>
          <h2 className="hospitales__department-name">Departamento de Resonancia Magnética - HGR #46</h2>
        </div>
      </header>
      {vista === '' && (
        <img
          src={mrMachine}
          alt="Máquina de resonancia magnética"
          className="hospitales__machine-image"
        />
      )}
      <div className="hospitales__content">
        {mensaje && <div className="hospitales__message-confirmation">{mensaje}</div>}
        {vista === 'crear' && (
          <FormularioHospital
            modo="crear"
            onSubmit={handleCrearHospital}
            onCancel={() => navigate('/ver-hospitales')}
          />
        )}
        {vista === 'ver' && (
          <>
            <div className="hospitales__search">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <select value={searchField} onChange={handleFieldChange}>
                <option value="nombre_hospital">Nombre del Hospital</option>
                <option value="ciudad_hospital">Ciudad del Hospital</option>
              </select>
            </div>
            <div className="hospitales__table-container">
              <table className="hospitales__table">
                <thead>
                  <tr>
                    <th>Nombre del Hospital</th>
                    <th>Dirección del Hospital</th>
                  </tr>
                </thead>
                <tbody>
                  {currentHospitales.map((hospital) => (
                    <tr key={hospital.id}>
                      <td>{hospital.nombre_hospital}</td>
                      <td>{hospital.ciudad_hospital}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="hospitales__pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`hospitales__pagination-button ${
                      page === currentPage ? 'hospitales__pagination-button--active' : ''
                    }`}
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
            <div className="hospitales__search">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <select value={searchField} onChange={handleFieldChange}>
                <option value="nombre_hospital">Nombre del Hospital</option>
                <option value="ciudad_hospital">Ciudad del Hospital</option>
              </select>
            </div>
            <div className="hospitales__table-container">
              <table className="hospitales__table">
                <thead>
                  <tr>
                    <th>Nombre del Hospital</th>
                    <th>Dirección del Hospital</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentHospitales.map((hospital) => (
                    <tr key={hospital.id}>
                      <td>
                        <input
                          type="text"
                          value={hospital.nombre_hospital}
                          onChange={(e) => {
                            const newHospitales = [...hospitales];
                            const index = newHospitales.findIndex((h) => h.id === hospital.id);
                            newHospitales[index].nombre_hospital = e.target.value;
                            setHospitales(newHospitales);
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={hospital.ciudad_hospital}
                          onChange={(e) => {
                            const newHospitales = [...hospitales];
                            const index = newHospitales.findIndex((h) => h.id === hospital.id);
                            newHospitales[index].ciudad_hospital = e.target.value;
                            setHospitales(newHospitales);
                          }}
                        />
                      </td>
                      <td>
                        <div className="hospitales__actions">
                          <button
                            onClick={() => handleEditarHospital(hospital)}
                            className="hospitales__button hospitales__button--guardar"
                          >
                            Guardar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="hospitales__pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`hospitales__pagination-button ${
                      page === currentPage ? 'hospitales__pagination-button--active' : ''
                    }`}
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
            <div className="hospitales__search">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <select value={searchField} onChange={handleFieldChange}>
                <option value="nombre_hospital">Nombre del Hospital</option>
                <option value="ciudad_hospital">Ciudad del Hospital</option>
              </select>
            </div>
            <div className="hospitales__table-container">
              <table className="hospitales__table">
                <thead>
                  <tr>
                    <th>Nombre del Hospital</th>
                    <th>Dirección del Hospital</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentHospitales.map((hospital) => (
                    <tr key={hospital.id}>
                      <td>{hospital.nombre_hospital}</td>
                      <td>{hospital.ciudad_hospital}</td>
                      <td>
                        <div className="hospitales__actions">
                          <button
                            onClick={() => handleEliminarHospital(hospital.id)}
                            className="hospitales__button hospitales__button--eliminar"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="hospitales__pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`hospitales__pagination-button ${
                      page === currentPage ? 'hospitales__pagination-button--active' : ''
                    }`}
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
          mensaje="¿Estás seguro de que deseas eliminar este hospital?"
          onConfirm={confirmarEliminarHospital}
          onCancel={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
};

export default Hospitales;
