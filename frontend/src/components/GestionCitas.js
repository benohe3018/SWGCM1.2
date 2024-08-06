import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './GestionCitas.css';
import logoIMSS from '../images/LogoIMSS.jpg';
import { getPacientesPrueba, createPacientePrueba, updatePacientePrueba, deletePacientePrueba, getMedicos, getEstudios } from './citasService';
import FormularioPaciente from './FormularioPaciente';
import ModalConfirmacion from './ModalConfirmacion';
import mrMachine from '../images/MRMachine.jpg';

const GestionCitas = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [vista, setVista] = useState('');
  const [pacientesPrueba, setPacientesPrueba] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [estudios, setEstudios] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pacientesPerPage = 10;

  useEffect(() => {
    if (location.pathname === '/crear-cita') {
      setVista('crear');
    } else if (location.pathname === '/ver-citas') {
      setVista('ver');
    } else if (location.pathname === '/editar-citas') {
      setVista('editar');
    } else if (location.pathname === '/eliminar-citas') {
      setVista('eliminar');
    }
  }, [location.pathname]);

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
      setError("Hubo un problema al cargar las citas. Por favor, intente de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const handleCrearPaciente = async (datosPaciente) => {
    try {
      await createPacientePrueba(datosPaciente);
      await cargarPacientesPrueba();
      setVista('ver');
      setMensaje('La cita se ha creado exitosamente.');
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      setError("No se pudo crear la cita. Por favor, intente de nuevo.");
    }
  };

  const handleEditarPaciente = async (pacienteEditado) => {
    try {
      if (!pacienteEditado.id) {
        throw new Error("El ID del paciente no está definido");
      }
  
      const pacienteData = {
        id: pacienteEditado.id,
        fecha_hora_estudio: pacienteEditado.fecha_hora_estudio,
        nss: pacienteEditado.nss,
        nombre_paciente: pacienteEditado.nombre_completo.split(' ')[0], // Assuming first word is the first name
        apellido_paterno_paciente: pacienteEditado.nombre_completo.split(' ')[1], // Assuming second word is the paternal surname
        apellido_materno_paciente: pacienteEditado.nombre_completo.split(' ')[2], // Assuming third word is the maternal surname
        especialidad_medica: pacienteEditado.especialidad_medica,
        nombre_completo_medico: pacienteEditado.nombre_completo_medico,
        estudio_solicitado: pacienteEditado.estudio_solicitado,
        unidad_medica_procedencia: pacienteEditado.unidad_medica_procedencia,
        diagnostico_presuntivo: pacienteEditado.diagnostico_presuntivo
      };
  
      await updatePacientePrueba(pacienteEditado.id, pacienteData);
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
      setMensaje('Cita eliminada exitosamente.');
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      setError("No se pudo eliminar la cita. Por favor, intente de nuevo.");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPacientes = pacientesPrueba.filter((paciente) => {
    return paciente.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastPaciente = currentPage * pacientesPerPage;
  const indexOfFirstPaciente = indexOfLastPaciente - pacientesPerPage;
  const currentPacientes = filteredPacientes.slice(indexOfFirstPaciente, indexOfLastPaciente);

  const totalPages = Math.ceil(filteredPacientes.length / pacientesPerPage);

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
                </tr>
              </thead>
              <tbody>
                {currentPacientes.map((paciente) => (
                  <tr key={paciente.id}>
                    <td>{paciente.id}</td>
                    <td>{paciente.fecha_hora_estudio}</td>
                    <td>{paciente.nombre_completo}</td>
                    <td>{paciente.nombre_completo_medico}</td>
                    <td>{paciente.estudio_solicitado}</td>
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
        )}
        {vista === 'editar' && (
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
                {currentPacientes.map((paciente) => (
                  <tr key={paciente.id}>
                    <td>{paciente.id}</td>
                    <td>
                      <input
                        type="datetime-local"
                        value={paciente.fecha_hora_estudio}
                        onChange={(e) => {
                          const newPacientes = [...pacientesPrueba];
                          const index = newPacientes.findIndex(p => p.id === paciente.id);
                          newPacientes[index].fecha_hora_estudio = e.target.value;
                          setPacientesPrueba(newPacientes);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={paciente.nombre_completo}
                        onChange={(e) => {
                          const newPacientes = [...pacientesPrueba];
                          const index = newPacientes.findIndex(p => p.id === paciente.id);
                          newPacientes[index].nombre_completo = e.target.value;
                          setPacientesPrueba(newPacientes);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={paciente.nombre_completo_medico}
                        onChange={(e) => {
                          const newPacientes = [...pacientesPrueba];
                          const index = newPacientes.findIndex(p => p.id === paciente.id);
                          newPacientes[index].nombre_completo_medico = e.target.value;
                          setPacientesPrueba(newPacientes);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={paciente.estudio_solicitado}
                        onChange={(e) => {
                          const newPacientes = [...pacientesPrueba];
                          const index = newPacientes.findIndex(p => p.id === paciente.id);
                          newPacientes[index].estudio_solicitado = e.target.value;
                          setPacientesPrueba(newPacientes);
                        }}
                      />
                    </td>
                    <td>
                      <div className="botones-acciones">
                        <button
                          onClick={() => handleEditarPaciente(paciente)}
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
        )}
        {vista === 'eliminar' && (
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
                {currentPacientes.map((paciente) => (
                  <tr key={paciente.id}>
                    <td>{paciente.id}</td>
                    <td>{paciente.fecha_hora_estudio}</td>
                    <td>{paciente.nombre_completo}</td>
                    <td>{paciente.nombre_completo_medico}</td>
                    <td>{paciente.estudio_solicitado}</td>
                    <td>
                      <div className="botones-acciones">
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
        )}
      </div>
      {mostrarModal && (
        <ModalConfirmacion
          mensaje="¿Estás seguro de que deseas eliminar esta cita?"
          onConfirm={confirmarEliminarPaciente}
          onCancel={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
};

export default GestionCitas;
