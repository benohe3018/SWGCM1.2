// En UnidadesMedicinaFamiliar.js

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UnidadesMedicinaFamiliar.css'; 
import { getUnidades, createUnidad, updateUnidad, deleteUnidad } from './unidadesMedicinaFamiliarService';
import FormularioUnidad from './FormularioUnidad';
import ModalConfirmacion from './ModalConfirmacion';
import logoIMSS from '../images/LogoIMSS.jpg';
import mrMachine from '../images/MRMachine.jpg';

const UnidadesMedicinaFamiliar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [unidades, setUnidades] = useState([]);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [vista, setVista] = useState('');

  useEffect(() => {
    if (location.pathname === '/crear-unidad') {
      setVista('crear');
    } else if (location.pathname === '/ver-unidades') {
      setVista('ver');
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

  const handleCrearUnidad = async (nuevaUnidad) => {
    console.log('Creating unit:', nuevaUnidad); // Añadir log para verificar la unidad a crear
    try {
      await createUnidad(nuevaUnidad);
      await cargarUnidades();
      navigate('/ver-unidades');
      setMensaje('Unidad creada exitosamente.');
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      console.error("Error al crear unidad:", error);
      setError("No se pudo crear la unidad. Por favor, intente de nuevo.");
    }
  };

  const handleEditarUnidad = async (unidadEditada) => {
    try {
      if (!unidadEditada.id_unidad_medica) {
        throw new Error("El ID de la unidad no está definido");
      }
      await updateUnidad(unidadEditada.id_unidad_medica, unidadEditada);
      await cargarUnidades();
      setUnidadSeleccionada(null);
      navigate('/ver-unidades');
      setMensaje('Unidad actualizada exitosamente.');
      setTimeout(() => setMensaje(null), 3000);
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

  if (cargando) {
    return <div>Cargando unidades...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="unidades-medicina-familiar-page">
      <header className="unidades-medicina-familiar-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message">Sistema de Gestión de Unidades de Medicina Familiar</h1>
          <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
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
          <div className="tabla-unidades-container">
            <table className="tabla-unidades">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre de la Unidad</th>
                  <th>Dirección de la Unidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {unidades.map((unidad) => (
                  <tr key={unidad.id_unidad_medica}>
                    <td>{unidad.id_unidad_medica}</td>
                    <td>{unidad.nombre_unidad_medica}</td>
                    <td>{unidad.direccion_unidad_medica}</td>
                    <td>
                      <div className="botones-acciones">
                        <button
                          onClick={() => {
                            setUnidadSeleccionada(unidad);
                            setVista('editar');
                          }}
                          className="editar-button"
                        >
                          Editar
                        </button>
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
          </div>
        )}
        {vista === 'editar' && unidadSeleccionada && (
          <FormularioUnidad
            modo="editar"
            unidadInicial={unidadSeleccionada}
            onSubmit={handleEditarUnidad}
            onCancel={() => navigate('/ver-unidades')}
          />
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

