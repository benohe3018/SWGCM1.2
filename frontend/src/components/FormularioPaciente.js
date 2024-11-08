import React, { useState, useEffect } from 'react';
import './FormularioPaciente.css';
import {
  getEspecialidadesMedicas,
  getUnidadesMedicas,
  getDiagnosticosPresuntivos,
  getHospitales
} from './citasService';

const FormularioPaciente = ({
  modo,
  pacienteInicial,
  medicos,
  estudios,
  onSubmit,
  onCancel,
  formResetToggle,          // Añadido para resetear todo el formulario
  resetDateTimeFieldsToggle // Añadido para resetear solo fecha y hora
}) => {
  // Estado inicial del formulario
  const initialState = {
    id: '',
    fecha_hora_estudio: '',
    hora_estudio: '',
    nss: '',
    nombre_paciente: '',
    apellido_paterno_paciente: '',
    apellido_materno_paciente: '',
    especialidad_medica: '',
    id_medico_refiere: '',
    id_estudio_radiologico: '',
    unidad_medica_procedencia: '',
    diagnostico_presuntivo: '',
    nombre_completo_medico: '',
    estudio_solicitado: '',
    hospital_envia: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [especialidades, setEspecialidades] = useState([]);
  const [unidadesMedicas, setUnidadesMedicas] = useState([]);
  const [diagnosticosPresuntivos, setDiagnosticosPresuntivos] = useState([]);
  const [hospitales, setHospitales] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);

  // Efecto para resetear todo el formulario al cambiar formResetToggle
  useEffect(() => {
    setFormData(initialState);
  }, [formResetToggle]);

  // Efecto para resetear solo fecha y hora al cambiar resetDateTimeFieldsToggle
  useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      fecha_hora_estudio: '',
      hora_estudio: ''
    }));
  }, [resetDateTimeFieldsToggle]);

  useEffect(() => {
    if (modo === 'editar' && pacienteInicial) {
      setFormData({
        ...pacienteInicial,
        fecha_hora_estudio: pacienteInicial.fecha_hora_estudio.split('T')[0],
        hora_estudio: pacienteInicial.fecha_hora_estudio.split('T')[1],
        especialidad_medica: pacienteInicial.especialidad_medica.id_especialidad,
        id_medico_refiere: pacienteInicial.id_medico_refiere.id_medico,
        id_estudio_radiologico: pacienteInicial.id_estudio_radiologico.id_estudio,
        unidad_medica_procedencia: pacienteInicial.unidad_medica_procedencia.id_unidad,
        diagnostico_presuntivo: pacienteInicial.diagnostico_presuntivo.id_diagnostico,
        hospital_envia: pacienteInicial.hospital_envia.id_hospital
      });
    } else {
      setFormData(initialState);
    }
  }, [modo, pacienteInicial]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          especialidadesData,
          unidadesMedicasData,
          diagnosticosPresuntivosData,
          hospitalesData
        ] = await Promise.all([
          getEspecialidadesMedicas(),
          getUnidadesMedicas(),
          getDiagnosticosPresuntivos(),
          getHospitales()
        ]);

        setEspecialidades(especialidadesData);
        setUnidadesMedicas(unidadesMedicasData);
        setDiagnosticosPresuntivos(diagnosticosPresuntivosData);
        setHospitales(hospitalesData);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const generarHorariosDisponibles = () => {
      const horarios = [
        '07:15', '07:45', '08:25', '09:05', '09:45', '10:25', '11:05', '11:45', '12:25',
        '14:00', '14:40', '15:20', '16:00', '16:40', '17:20', '18:00', '18:40', '19:20'
      ];
      setHorariosDisponibles(horarios);
    };
    generarHorariosDisponibles();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleMedicoChange = (e) => {
    const selectedMedico = medicos.find(
      (medico) => medico.id_medico === parseInt(e.target.value)
    );
    setFormData({
      ...formData,
      id_medico_refiere: e.target.value,
      nombre_completo_medico: selectedMedico
        ? `${selectedMedico.nombre_medico} ${selectedMedico.apellido_paterno_medico} ${selectedMedico.apellido_materno_medico}`
        : ''
    });
  };

  const handleEstudioChange = (e) => {
    const selectedEstudio = estudios.find(
      (estudio) => estudio.id_estudio === parseInt(e.target.value)
    );
    setFormData({
      ...formData,
      id_estudio_radiologico: e.target.value,
      estudio_solicitado: selectedEstudio ? selectedEstudio.nombre_estudio : ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones existentes
    const isValidNSS = (nss) => /^\d{11}$/.test(nss);
    const isValidName = (name) =>
      /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/.test(name) &&
      name.length >= 1 &&
      name.length <= 50;
    const isValidSpeciality = (speciality) =>
      /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/.test(speciality) &&
      speciality.length >= 1 &&
      speciality.length <= 50;
    const isValidUnidadMedica = (unidad) => /^UMF#\d+$/.test(unidad);
    const isValidDiagnostico = (diagnostico) =>
      /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/.test(diagnostico) &&
      diagnostico.length >= 1 &&
      diagnostico.length <= 50;

    if (!isValidNSS(formData.nss)) {
      alert('El NSS debe ser un número de 11 dígitos.');
      return;
    }

    if (!isValidName(formData.nombre_paciente)) {
      alert('El nombre del paciente debe contener solo letras.');
      return;
    }

    if (!isValidName(formData.apellido_paterno_paciente)) {
      alert('El apellido paterno del paciente debe contener solo letras.');
      return;
    }

    if (!isValidName(formData.apellido_materno_paciente)) {
      alert('El apellido materno del paciente debe contener solo letras.');
      return;
    }

    if (!isValidSpeciality(formData.especialidad_medica)) {
      alert('La especialidad médica debe contener solo letras.');
      return;
    }

    if (!formData.id_medico_refiere) {
      alert('Debe seleccionar un médico que refiere.');
      return;
    }

    if (!formData.id_estudio_radiologico) {
      alert('Debe seleccionar un estudio solicitado.');
      return;
    }

    if (!isValidUnidadMedica(formData.unidad_medica_procedencia)) {
      alert('La unidad médica de procedencia debe seguir el formato UMF#número.');
      return;
    }

    if (!isValidDiagnostico(formData.diagnostico_presuntivo)) {
      alert('El diagnóstico presuntivo debe contener solo letras y espacios.');
      return;
    }

    const formattedDateTime = `${formData.fecha_hora_estudio}T${formData.hora_estudio}`;
    console.log('Fecha y hora formateadas:', formattedDateTime);

    const pacienteData = {
      ...formData,
      fecha_hora_estudio: formattedDateTime
    };

    try {
      console.log('Datos del paciente enviados:', pacienteData);
      onSubmit(pacienteData);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  const handleCancel = () => {
    const isConfirmed = window.confirm(
      '¿Está seguro que desea cancelar? Los cambios no guardados se perderán.'
    );

    if (isConfirmed) {
      setFormData(initialState);
      onCancel();
    }
  };

  return (
    <form className="form-paciente" onSubmit={handleSubmit}>
      <h3 className="form-description-create-cita">
        Capture los datos de la cita
      </h3>
      <div className="form-group-cita-medica">
        <label htmlFor="fecha_hora_estudio">Fecha del Estudio:</label>
        <input
          type="date"
          id="fecha_hora_estudio"
          name="fecha_hora_estudio"
          value={formData.fecha_hora_estudio}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group-cita-medica">
        <label htmlFor="hora_estudio">Hora del Estudio:</label>
        <select
          id="hora_estudio"
          name="hora_estudio"
          value={formData.hora_estudio}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione una hora</option>
          {horariosDisponibles.map((hora) => (
            <option key={hora} value={hora}>
              {hora}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group-cita-medica">
        <label htmlFor="nss">NSS del Paciente:</label>
        <input
          type="text"
          id="nss"
          name="nss"
          value={formData.nss}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group-cita-medica">
        <label htmlFor="nombre_paciente">Nombre del Paciente:</label>
        <input
          type="text"
          id="nombre_paciente"
          name="nombre_paciente"
          value={formData.nombre_paciente}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group-cita-medica">
        <label htmlFor="apellido_paterno_paciente">
          Apellido Paterno del Paciente:
        </label>
        <input
          type="text"
          id="apellido_paterno_paciente"
          name="apellido_paterno_paciente"
          value={formData.apellido_paterno_paciente}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group-cita-medica">
        <label htmlFor="apellido_materno_paciente">
          Apellido Materno del Paciente:
        </label>
        <input
          type="text"
          id="apellido_materno_paciente"
          name="apellido_materno_paciente"
          value={formData.apellido_materno_paciente}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group-cita-medica">
        <label htmlFor="especialidad_medica">
          Especialidad Médica que Envía:
        </label>
        <select
          id="especialidad_medica"
          name="especialidad_medica"
          value={formData.especialidad_medica}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione una Especialidad</option>
          {especialidades.map((especialidad) => (
            <option
              key={especialidad.id_especialidad}
              value={especialidad.id_especialidad}
            >
              {especialidad.nombre_especialidad}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group-cita-medica">
        <label htmlFor="id_medico_refiere">Médico que Refiere:</label>
        <select
          id="id_medico_refiere"
          name="id_medico_refiere"
          value={formData.id_medico_refiere}
          onChange={handleMedicoChange}
          required
        >
          <option value="">Seleccione un Médico</option>
          {medicos.map((medico) => (
            <option key={medico.id_medico} value={medico.id_medico}>
              {`${medico.nombre_medico} ${medico.apellido_paterno_medico} ${medico.apellido_materno_medico}`}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group-cita-medica">
        <label htmlFor="id_estudio_radiologico">Estudio Solicitado:</label>
        <select
          id="id_estudio_radiologico"
          name="id_estudio_radiologico"
          value={formData.id_estudio_radiologico}
          onChange={handleEstudioChange}
          required
        >
          <option value="">Seleccione un Estudio</option>
          {estudios.map((estudio) => (
            <option key={estudio.id_estudio} value={estudio.id_estudio}>
              {estudio.nombre_estudio}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group-cita-medica">
        <label htmlFor="unidad_medica_procedencia">
          Unidad Médica de Procedencia:
        </label>
        <select
          id="unidad_medica_procedencia"
          name="unidad_medica_procedencia"
          value={formData.unidad_medica_procedencia}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione una Unidad Médica</option>
          {unidadesMedicas.map((unidad) => (
            <option key={unidad.id_unidad} value={unidad.id_unidad}>
              {unidad.nombre_unidad}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group-cita-medica">
        <label htmlFor="diagnostico_presuntivo">Diagnóstico Presuntivo:</label>
        <select
          id="diagnostico_presuntivo"
          name="diagnostico_presuntivo"
          value={formData.diagnostico_presuntivo}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un Diagnóstico</option>
          {diagnosticosPresuntivos.map((diagnostico) => (
            <option
              key={diagnostico.id_diagnostico}
              value={diagnostico.id_diagnostico}
            >
              {diagnostico.nombre_diagnostico}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group-cita-medica">
        <label htmlFor="hospital_envia">Hospital que Envía:</label>
        <select
          id="hospital_envia"
          name="hospital_envia"
          value={formData.hospital_envia}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un Hospital</option>
          {hospitales.map((hospital) => (
            <option key={hospital.id_hospital} value={hospital.id_hospital}>
              {hospital.nombre_hospital}
            </option>
          ))}
        </select>
      </div>
      <div className="form-actions">
        <button type="submit">Enviar</button>
        <button type="button" onClick={handleCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default FormularioPaciente;