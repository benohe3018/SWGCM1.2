import React, { useState, useEffect } from 'react';
import './FormularioPaciente.css';

const FormularioPaciente = ({ modo, pacienteInicial, medicos, estudios, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    fecha_hora_estudio: '',
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
    estudio_solicitado: ''
  });

  useEffect(() => {
    if (modo === 'editar' && pacienteInicial) {
      setFormData({
        ...pacienteInicial,
        id: pacienteInicial.id || ''
      });
    }
  }, [modo, pacienteInicial]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleMedicoChange = (e) => {
    const selectedMedico = medicos.find(medico => medico.id_medico === parseInt(e.target.value));
    setFormData({
      ...formData,
      id_medico_refiere: e.target.value,
      nombre_completo_medico: selectedMedico ? `${selectedMedico.nombre_medico} ${selectedMedico.apellido_paterno_medico} ${selectedMedico.apellido_materno_medico}` : ''
    });
  };

  const handleEstudioChange = (e) => {
    const selectedEstudio = estudios.find(estudio => estudio.id_estudio === parseInt(e.target.value));
    setFormData({
      ...formData,
      id_estudio_radiologico: e.target.value,
      estudio_solicitado: selectedEstudio ? selectedEstudio.nombre_estudio : ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    const isValidNSS = (nss) => /^\d{11}$/.test(nss);
    const isValidName = (name) => /^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/.test(name) && name.length >= 1 && name.length <= 50;
    const isValidSpeciality = (speciality) => /^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/.test(speciality) && speciality.length >= 1 && speciality.length <= 50;
    const isValidUnidadMedica = (unidad) => /^\d+$/.test(unidad);
    const isValidDiagnostico = (diagnostico) => /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/.test(diagnostico) && diagnostico.length >= 1 && diagnostico.length <= 50;

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
      alert('La unidad médica de procedencia debe contener solo números.');
      return;
    }

    if (!isValidDiagnostico(formData.diagnostico_presuntivo)) {
      alert('El diagnóstico presuntivo debe contener solo letras y espacios.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form className="form-paciente" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="fecha_hora_estudio">Fecha y Hora del Estudio:</label>
        <input type="datetime-local" id="fecha_hora_estudio" name="fecha_hora_estudio" value={formData.fecha_hora_estudio} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="nss">NSS del Paciente:</label>
        <input type="text" id="nss" name="nss" value={formData.nss} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="nombre_paciente">Nombre del Paciente:</label>
        <input type="text" id="nombre_paciente" name="nombre_paciente" value={formData.nombre_paciente} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="apellido_paterno_paciente">Apellido Paterno del Paciente:</label>
        <input type="text" id="apellido_paterno_paciente" name="apellido_paterno_paciente" value={formData.apellido_paterno_paciente} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="apellido_materno_paciente">Apellido Materno del Paciente:</label>
        <input type="text" id="apellido_materno_paciente" name="apellido_materno_paciente" value={formData.apellido_materno_paciente} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="especialidad_medica">Especialidad Médica que Envía:</label>
        <input type="text" id="especialidad_medica" name="especialidad_medica" value={formData.especialidad_medica} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="id_medico_refiere">Médico que Refiere:</label>
        <select id="id_medico_refiere" name="id_medico_refiere" value={formData.id_medico_refiere} onChange={handleMedicoChange} required>
          <option value="">Seleccione un Médico</option>
          {medicos.map((medico) => (
            <option key={medico.id_medico} value={medico.id_medico}>
              {`${medico.nombre_medico} ${medico.apellido_paterno_medico} ${medico.apellido_materno_medico}`}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="id_estudio_radiologico">Estudio Solicitado:</label>
        <select id="id_estudio_radiologico" name="id_estudio_radiologico" value={formData.id_estudio_radiologico} onChange={handleEstudioChange} required>
          <option value="">Seleccione un Estudio</option>
          {estudios.map((estudio) => (
            <option key={estudio.id_estudio} value={estudio.id_estudio}>
              {estudio.nombre_estudio}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="unidad_medica_procedencia">Unidad Médica de Procedencia:</label>
        <input type="text" id="unidad_medica_procedencia" name="unidad_medica_procedencia" value={formData.unidad_medica_procedencia} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="diagnostico_presuntivo">Diagnóstico Presuntivo:</label>
        <input type="text" id="diagnostico_presuntivo" name="diagnostico_presuntivo" value={formData.diagnostico_presuntivo} onChange={handleChange} required />
      </div>
      <div className="form-actions">
        <button type="submit">Enviar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default FormularioPaciente;
