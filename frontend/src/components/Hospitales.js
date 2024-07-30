// Hospitales.js
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
    const ciudadRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ][a-zA-Z0-9\s#,.]*$/;
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
    console.log('Creating hospital:', nuevoHospital); // Añadir log para verificar el hospital a crear
  
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
      setTimeout(() => {
        setMensaje(null);
        navigate('/ver-hospitales'); // Navega a 'Ver Hospitales' después de un tiempo
      }, 3000); // Espera 3 segundos antes de navegar
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
      await cargarHospitales();
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
      await cargarHospitales();
      setMostrarModal(false);
      setHospitalSeleccionado(null);
      setMensaje('Hospital eliminado exitosamente.');
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      console.error("Error al eliminar hospital:", error);
      setError("No se pudo eliminar el hospital. Por favor, intente de nuevo.");
    }
  };

  if (cargando) {
    return <div>Cargando hospitales...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="hospitales-page">
      <header className="hospitales-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message">Sistema de Gestión de Hospitales</h1>
          <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
        </div>
      </header>
      {vista === '' && <img src={mrMachine} alt="Máquina de resonancia magnética" className="mr-machine" />}
      <div className="hospitales-content">
        {mensaje && <div className="mensaje-confirmacion">{mensaje}</div>}
        {vista === 'crear' && (
          <FormularioHospital
            modo="crear"
            onSubmit={handleCrearHospital}
            onCancel={() => navigate('/ver-hospitales')}
          />
        )}
        {vista === 'ver' && (
          <div className="tabla-hospitales-container">
            <table className="tabla-hospitales">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre del Hospital</th>
                  <th>Ciudad del Hospital</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {hospitales.map((hospital) => (
                  <tr key={hospital.id}>
                    <td>{hospital.id}</td>
                    <td>{hospital.nombre_hospital}</td>
                    <td>{hospital.ciudad_hospital}</td>
                    <td>
                      <div className="botones-acciones">
                        <button
                          onClick={() => {
                            setHospitalSeleccionado(hospital);
                            setVista('editar');
                          }}
                          className="editar-button"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminarHospital(hospital.id)}
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
          </div>
        )}
        {vista === 'editar' && hospitalSeleccionado && (
          <FormularioHospital
            modo="editar"
            hospitalInicial={hospitalSeleccionado}
            onSubmit={handleEditarHospital}
            onCancel={() => navigate('/ver-hospitales')}
          />
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

