import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import './GestionCitas.css';
import logoIMSS from '../images/LogoIMSS.jpg';
import { getPacientesPrueba, createPacientePrueba, updatePacientePrueba, deletePacientePrueba, getMedicos, getEstudios } from './citasService';
import FormularioPaciente from './FormularioPaciente';
import ModalConfirmacion from './ModalConfirmacion';
import mrMachine from '../images/MRMachine.jpg';

const GestionCitas = () => {
  const location = useLocation();
  const [vista, setVista] = useState('');

  useEffect(() => {
    if (location.pathname === '/crear-cita') {
      setVista('crear');
    } else if (location.pathname === '/ver-citas') {
      setVista('ver');
    }
  }, [location.pathname]);

  const [pacientesPrueba, setPacientesPrueba] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [estudios, setEstudios] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true);

  const inicializarDatos = useCallback(async () => {
    try {
      setCargando(true);
      const [pacientesData, medicosData, estudiosData] = await Promise.all([
        getPacientesPrueba(),
        getMedicos(),
        getEstudios()
      ]);
      pacientesData.sort((a, b) => a.id - b.id);
      setPacientesPrueba(pacientesData);
      setMedicos(medicosData);
      setEstudios(estudiosData);
      setError(null);
    } catch (error) {
      console.error("Error al inicializar datos:", error);
      setError("Hubo un problema al cargar los datos. Por favor, intente de nuevo.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    inicializarDatos();
  }, [inicializarDatos]);

  const cargarPacientesPrueba = async () => {
    try {
      setCargando(true);
      const data = await getPacientesPrueba();
      data.sort((a, b) => a.id - b.id);
      setPacientesPrueba(data);
      setError(null);
    } catch (error) {
      setError("Hubo un problema al cargar los pacientes de prueba. Por favor, intente de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const handleCrearPaciente = async (datosPaciente) => {
    try {
      await createPacientePrueba(datosPaciente);
      await cargarPacientesPrueba();
      setVista('ver');
      setMensaje('Paciente de prueba creado exitosamente.');
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      setError("No se pudo crear el paciente de prueba. Por favor, intente de nuevo.");
    }
  };

  const handleEditarPaciente = async (pacienteEditado) => {
    try {
      if (!pacienteEditado.id) {
        throw new Error("El ID del paciente no está definido");
      }
      await updatePacientePrueba(pacienteEditado.id, pacienteEditado);
      await cargarPacientesPrueba();
      setPacienteSeleccionado(null);
      setVista('ver');
      setMensaje('Paciente actualizado exitosamente.');
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      setError("No se pudo editar el paciente. Por favor, intente de nuevo.");
    }
  };

  const handleEliminarPaciente = (id) => {
    const numericId = Number(id);
    const paciente = pacientesPrueba.find(p => p.id === numericId);
    if (paciente) {
      setPacienteSeleccionado(paciente);
      setMostrarModal(true);
    }
  };

  const confirmarEliminarPaciente = async () => {
    try {
      await deletePacientePrueba(pacienteSeleccionado.id);
      await cargarPacientesPrueba();
      setMostrarModal(false);
      setPacienteSeleccionado(null);
      setMensaje('Paciente eliminado exitosamente.');
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      setError("No se pudo eliminar el paciente. Por favor, intente de nuevo.");
    }
  };

  if (cargando) {
    return <div>Cargando datos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="gestion-citas-page">
      <header className="gestion-citas-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message">Sistema de Gestión de Citas Médicas</h1>
          <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
        </div>
      </header>
      {vista === '' && <img src={mrMachine} alt="Máquina de resonancia magnética" className="mr-machine" />}
      <div className="gestion-citas-content">
        {mensaje && <div className="mensaje-confirmacion">{mensaje}</div>}
        {vista === 'crear' && (
          <FormularioPaciente
            modo="crear"
            medicos={medicos}
            estudios={estudios}
            onSubmit={handleCrearPaciente}
            onCancel={() => setVista('ver')}
          />
        )}

        {vista === 'ver' && (
          <div className="tabla-citas-container">
            <table className="tabla-citas">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha y Hora</th>
                  <th>Paciente</th>
                  <th>Médico</th>
                  <th>Estudio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pacientesPrueba.map((paciente) => (
                  <tr key={paciente.id}>
                    <td>{paciente.id}</td>
                    <td>{paciente.fecha_hora_estudio}</td>
                    <td>{paciente.nombre_completo}</td>
                    <td>{paciente.nombre_completo_medico}</td>
                    <td>{paciente.estudio_solicitado}</td>
                    <td>
                      <div className="botones-acciones">
                        <button
                          onClick={() => {
                            setPacienteSeleccionado(paciente);
                            setVista('editar');
                          }}
                          className="editar-button"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminarPaciente(paciente.id)}
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
        {vista === 'editar' && pacienteSeleccionado && (
          <FormularioPaciente
            modo="editar"
            pacienteInicial={pacienteSeleccionado}
            medicos={medicos}
            estudios={estudios}
            onSubmit={handleEditarPaciente}
            onCancel={() => setVista('ver')}
          />
        )}
      </div>
      {mostrarModal && (
        <ModalConfirmacion
          mensaje="¿Estás seguro de que deseas eliminar este paciente de prueba?"
          onConfirm={confirmarEliminarPaciente}
          onCancel={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
};

export default GestionCitas;

