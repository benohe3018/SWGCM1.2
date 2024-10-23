import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import './GestionCitas.css';
import logoIMSS from '../images/LogoIMSS.jpg';
import { getPacientesPrueba, updatePacientePrueba, deletePacientePrueba, getMedicos, getEstudios, getHospitales } from './citasService';
import FormularioPaciente from './FormularioPaciente';
import ModalConfirmacion from './ModalConfirmacion';
import mrMachine from '../images/MRMachine.jpg';

const GestionCitas = () => {
  const location = useLocation();
  const [vista, setVista] = useState('');
  const [pacientesPrueba, setPacientesPrueba] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [estudios, setEstudios] = useState([]);
  const [hospitales, setHospitales] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('nombre_completo');
  const pacientesPerPage = 10;
  const [formResetToggle, setFormResetToggle] = useState(false);

  const handleInputChange = (e, pacienteId, campo) => {
    const newPacientes = [...pacientesPrueba];
    const index = newPacientes.findIndex(p => p.id === pacienteId);
    if (index !== -1) {
      newPacientes[index][campo] = e.target.value;
      setPacientesPrueba(newPacientes);
    }
  };

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 5000); // 5000 milisegundos = 5 segundos

      // Limpia el temporizador si el componente se desmonta o si 'mensaje' cambia
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

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
      const [pacientesData, medicosData, estudiosData, hospitalesData] = await Promise.all([
        getPacientesPrueba(),
        getMedicos(),
        getEstudios(),
        getHospitales()
      ]);
       console.log('Datos inicializados:', { pacientesData, medicosData, estudiosData, hospitalesData });
      pacientesData.sort((a, b) => a.id - b.id);
      setPacientesPrueba(pacientesData);
      setMedicos(Array.isArray(medicosData) ? medicosData : [medicosData]);
    setEstudios(Array.isArray(estudiosData) ? estudiosData : [estudiosData]);
    setHospitales(Array.isArray(hospitalesData) ? hospitalesData : [hospitalesData]);
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
        const response = await fetch('/api/pacientes_prueba', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosPaciente),
        });

        const result = await response.json();

        if (response.ok) {
            setMensaje(result.message);
            setError(null);
            // Reinicia el formulario cambiando el estado
            setFormResetToggle(prev => !prev); // Alterna entre true y false
            setVista('crear'); // Mantén la vista en 'crear'
            cargarPacientesPrueba(); // Recargar los datos después de crear
        } else {
            setError(result.error);
            setMensaje(null);
            setVista('crear'); // Mantener la vista en 'crear' incluso en caso de error
        }
    } catch (error) {
        setError('Error al crear el paciente');
        setMensaje(null);
        setVista('crear'); // Mantener la vista en 'crear' incluso en caso de error
    }
};

const handleEditarPaciente = async (pacienteEditado) => {
  try {
      if (!pacienteEditado.id) {
          throw new Error("El ID del paciente no está definido");
      }

      const nombreCompletoParts = pacienteEditado.nombre_completo.split(' ');
      if (nombreCompletoParts.length < 3) {
          throw new Error("El nombre completo debe incluir nombre, apellido paterno y apellido materno");
      }

      const pacienteData = {
          id: pacienteEditado.id,
          fecha_hora_estudio: pacienteEditado.fecha_hora_estudio,
          nss: pacienteEditado.nss,
          nombre_paciente: nombreCompletoParts[0],
          apellido_paterno_paciente: nombreCompletoParts[1],
          apellido_materno_paciente: nombreCompletoParts[2],
          especialidad_medica: pacienteEditado.especialidad_medica,
          nombre_completo_medico: pacienteEditado.nombre_completo_medico,
          estudio_solicitado: pacienteEditado.estudio_solicitado,
          unidad_medica_procedencia: pacienteEditado.unidad_medica_procedencia,
          diagnostico_presuntivo: pacienteEditado.diagnostico_presuntivo,
          hospital_envia: pacienteEditado.hospital_envia
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

  const handleFieldChange = (e) =>{
    setSearchField(e.target.value);
  }

  const filteredPacientes = pacientesPrueba.filter((paciente) => {
    if (!searchTerm) {
      return true; // Mostrar todos los pacientes si no hay término de búsqueda
    }
    if (!searchField) {
      // Si no se ha seleccionado un campo específico, puedes buscar en todos los campos
      return Object.values(paciente).some((field) =>
        field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    const fieldValue = paciente[searchField];
    if (fieldValue) {
      return fieldValue.toString().toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return false;
    }
  });

  const indexOfLastPaciente = currentPage * pacientesPerPage;
  const indexOfFirstPaciente = indexOfLastPaciente - pacientesPerPage;
  const currentPacientes = filteredPacientes.slice(indexOfFirstPaciente, indexOfLastPaciente);

  const totalPages = Math.ceil(filteredPacientes.length / pacientesPerPage);

  if (cargando) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div className="gestion-citas">
      <header className="gestion-citas__header">
        <img src={logoIMSS} alt="Logo IMSS" className="gestion-citas__header-logo" />
        <div className="gestion-citas__header-texts">
          <h1 className="gestion-citas__welcome-message">Sistema de Gestión de Citas Médicas</h1>
          <h2 className="gestion-citas__department-name">Departamento de Resonancia Magnética - HGR #46</h2>
        </div>
      </header>
      {vista === '' && <img src={mrMachine} alt="Máquina de resonancia magnética" className="gestion-citas__mr-machine" />}
      <div className="gestion-citas__content">
      {mensaje && <div className="gestion-citas__message-confirmation">{mensaje}</div>}
      {error && <div className="gestion-citas__message-error">{error}</div>}
        
        {/* Campo de búsqueda */}
        {vista !== 'crear' && (
        <div className="gestion-citas__search-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select value={searchField} onChange={handleFieldChange}>
          <option value="">Seleccione</option>
          <option value="nombre_completo">Paciente</option>
          <option value="nombre_completo_medico">Médico</option>
          <option value="estudio_solicitado">Estudio</option>
          <option value="hospital_envia">Hospital</option>
          <option value="fecha_hora_estudio">Fecha y Hora</option>
        </select>
      </div>
    )}
        
        {vista === 'crear' && (
          <FormularioPaciente
            modo="crear"
            medicos={medicos}
            estudios={estudios}
            hospitales={hospitales}
            onSubmit={handleCrearPaciente}
            pacienteSeleccionado={pacienteSeleccionado}
            setPacienteSeleccionado={setPacienteSeleccionado}
            onCancel={() => setVista('ver')}
            formResetToggle={formResetToggle}
          />
        )}

        {vista === 'ver' && (
          <>
            <div className="gestion-citas__table-container">
              <table className="gestion-citas__table gestion-citas__table--ver">
                <thead>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>Paciente</th>
                    <th>Médico</th>
                    <th>Estudio</th>
                    <th>Hospital</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPacientes.map((paciente) => (
                    <tr key={paciente.id}>
                      <td>{paciente.fecha_hora_estudio}</td>
                      <td>{paciente.nombre_completo}</td>
                      <td>{paciente.nombre_completo_medico}</td>
                      <td>{paciente.estudio_solicitado}</td>
                      <td>{paciente.hospital_envia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="gestion-citas__cards-container">
              {currentPacientes.map((paciente) => (
                <div key={paciente.id} className="gestion-citas__card">
                  <div className="gestion-citas__card-item">
                    <strong>Fecha y Hora:</strong> {paciente.fecha_hora_estudio}
                  </div>
                  <div className="gestion-citas__card-item">
                    <strong>Paciente:</strong> {paciente.nombre_completo}
                  </div>
                  <div className="gestion-citas__card-item">
                    <strong>Médico:</strong> {paciente.nombre_completo_medico}
                  </div>
                  <div className="gestion-citas__card-item">
                    <strong>Estudio:</strong> {paciente.estudio_solicitado}
                  </div>
                  <div className="gestion-citas__card-item">
                    <strong>Hospital:</strong> {paciente.hospital_envia}
                  </div>
                </div>
              ))}
            </div>
            <div className="gestion-citas__pagination">
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
          </>
        )}

{vista === 'editar' && (
  <>
    <div className="gestion-citas__table-container">
      <table className="gestion-citas__table gestion-citas__table--editar">
        <thead>
          <tr>
            <th>Fecha y Hora</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Estudio</th>
            <th>Hospital</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentPacientes.map((paciente) => (
            <tr key={paciente.id}>
              <td>
                <input
                  className="gestion-citas__input"
                  type="datetime-local"
                  value={paciente.fecha_hora_estudio}
                  onChange={(e) => handleInputChange(e, paciente.id, 'fecha_hora_estudio')}
                />
              </td>
              <td>
                <input
                  className="gestion-citas__input"
                  type="text"
                  value={paciente.nombre_completo}
                  onChange={(e) => handleInputChange(e, paciente.id, 'nombre_completo')}
                />
              </td>
              <td>
                <select
                  className="gestion-citas__input"
                  value={paciente.nombre_completo_medico}
                  onChange={(e) => handleInputChange(e, paciente.id, 'nombre_completo_medico')}
                  disabled={!medicos.length}
                >
                  <option value="">Seleccione un médico</option>
                  {medicos.map((medico) => (
                    <option key={medico.id_medico} value={medico.id_medico}>
                      {`${medico.nombre_medico} ${medico.apellido_paterno_medico} ${medico.apellido_materno_medico}`}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  className="gestion-citas__input"
                  value={paciente.id_estudio_radiologico}
                  onChange={(e) => handleInputChange(e, paciente.id, 'id_estudio_radiologico')}
                  disabled={!estudios.length}
                >
                  <option value="">Seleccione un estudio</option>
                  {estudios.map((estudio) => (
                    <option key={estudio.id_estudio} value={estudio.id_estudio}>
                      {estudio.nombre_estudio}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  className="gestion-citas__input"
                  value={paciente.id_hospital_envia}
                  onChange={(e) => handleInputChange(e, paciente.id, 'id_hospital_envia')}
                  disabled={!hospitales.length}
                >
                  <option value="">Seleccione un hospital</option>
                  {hospitales.map((hospital) => (
                    <option key={hospital.id_hospita} value={hospital.id_hospital}>
                      {hospital.nombre_hospital}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <div className="gestion-citas__actions">
                  <button
                    onClick={() => handleEditarPaciente(paciente)}
                    className="gestion-citas__button gestion-citas__button--guardar"
                  >
                    Guardar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="gestion-citas__cards-container">
      {currentPacientes.map((paciente) => (
        <div key={paciente.id} className="gestion-citas__card">
          <div className="gestion-citas__card-item">
            <label><strong>Fecha y Hora:</strong></label>
            <input
              className="gestion-citas__input"
              type="datetime-local"
              value={paciente.fecha_hora_estudio}
              onChange={(e) => handleInputChange(e, paciente.id, 'fecha_hora_estudio')}
            />
          </div>
          <div className="gestion-citas__card-item">
            <label><strong>Paciente:</strong></label>
            <input
              className="gestion-citas__input"
              type="text"
              value={paciente.nombre_completo}
              onChange={(e) => handleInputChange(e, paciente.id, 'nombre_completo')}
            />
          </div>
          <div className="gestion-citas__card-item">
            <label><strong>Médico:</strong></label>
            <select
              className="gestion-citas__input"
              value={paciente.nombre_completo_medico}
              onChange={(e) => handleInputChange(e, paciente.id, 'nombre_completo_medico')}
              disabled={!medicos.length}
            >
              <option value="">Seleccione un médico</option>
              {medicos.map((medico) => (
                <option key={medico.id} value={medico.nombre_completo}>
                  {medico.nombre_completo}
                </option>
              ))}
            </select>
          </div>
          <div className="gestion-citas__card-item">
            <label><strong>Estudio:</strong></label>
            <select
              className="gestion-citas__input"
              value={paciente.estudio_solicitado}
              onChange={(e) => handleInputChange(e, paciente.id, 'estudio_solicitado')}
              disabled={!estudios.length}
            >
              <option value="">Seleccione un estudio</option>
              {estudios.map((estudio) => (
                <option key={estudio.id} value={estudio.nombre}>
                  {estudio.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="gestion-citas__card-item">
            <label><strong>Hospital:</strong></label>
            <select
              className="gestion-citas__input"
              value={paciente.hospital_envia}
              onChange={(e) => handleInputChange(e, paciente.id, 'hospital_envia')}
              disabled={!hospitales.length}
            >
              <option value="">Seleccione un hospital</option>
              {hospitales.map((hospital) => (
                <option key={hospital.id} value={hospital.nombre}>
                  {hospital.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="gestion-citas__actions">
            <button
              onClick={() => handleEditarPaciente(paciente)}
              className="gestion-citas__button gestion-citas__button--guardar"
            >
              Guardar
            </button>
          </div>
        </div>
      ))}
    </div>
    <div className="gestion-citas__pagination">
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
  </>
)}

        {vista === 'eliminar' && (
          <>
            <div className="gestion-citas__table-container">
      <table className="gestion-citas__table gestion-citas__table--eliminar">
        <thead>
          <tr>
            <th>Fecha y Hora</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Estudio</th>
            <th>Hospital</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentPacientes.map((paciente) => (
            <tr key={paciente.id}>
              <td>{paciente.fecha_hora_estudio}</td>
              <td>{paciente.nombre_completo}</td>
              <td>{paciente.nombre_completo_medico}</td>
              <td>{paciente.estudio_solicitado}</td>
              <td>{paciente.hospital_envia}</td>
              <td>
                <div className="gestion-citas__actions">
                  <button
                    onClick={() => handleEliminarPaciente(paciente.id)}
                    className="gestion-citas__button gestion-citas__button--eliminar"
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

    <div className="gestion-citas__cards-container">
      {currentPacientes.map((paciente) => (
        <div key={paciente.id} className="gestion-citas__card">
          <div className="gestion-citas__card-item">
            <strong>Fecha y Hora:</strong> {paciente.fecha_hora_estudio}
          </div>
          <div className="gestion-citas__card-item">
            <strong>Paciente:</strong> {paciente.nombre_completo}
          </div>
          <div className="gestion-citas__card-item">
            <strong>Médico:</strong> {paciente.nombre_completo_medico}
          </div>
          <div className="gestion-citas__card-item">
            <strong>Estudio:</strong> {paciente.estudio_solicitado}
          </div>
          <div className="gestion-citas__card-item">
            <strong>Hospital:</strong> {paciente.hospital_envia}
          </div>
          <div className="gestion-citas__actions">
            <button
              onClick={() => handleEliminarPaciente(paciente.id)}
              className="gestion-citas__button gestion-citas__button--eliminar"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
            <div className="gestion-citas__cards-container">
              {currentPacientes.map((paciente) => (
                <div key={paciente.id} className="gestion-citas__card">
                  <div className="gestion-citas__card-item">
                    <strong>Fecha y Hora:</strong> {paciente.fecha_hora_estudio}
                  </div>
                  <div className="gestion-citas__card-item">
                    <strong>Paciente:</strong> {paciente.nombre_completo}
                  </div>
                  <div className="gestion-citas__card-item">
                    <strong>Médico:</strong> {paciente.nombre_completo_medico}
                  </div>
                  <div className="gestion-citas__card-item">
                    <strong>Estudio:</strong> {paciente.estudio_solicitado}
                  </div>
                  <div className="gestion-citas__card-item">
                    <strong>Hospital:</strong> {paciente.hospital_envia}
                  </div>
                  <div className="gestion-citas__actions">
                    <button
                      onClick={() => handleEliminarPaciente(paciente.id)}
                      className="gestion-citas__button gestion-citas__button--eliminar"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="gestion-citas__pagination">
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
  </>
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