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

  const [errors, setErrors] = useState({});

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

  const validateFields = () => {
    let newErrors = {};

    // NSS del Paciente
    if (!/^\d{11}$/.test(formData.nss)) {
      newErrors.nss = 'El NSS debe ser un número de 11 dígitos.';
    }

    // Nombre del Paciente
    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/.test(formData.nombre_paciente)) {
      newErrors.nombre_paciente = 'El nombre del paciente debe contener solo letras y espacios.';
    }

    // Apellido Paterno del Paciente
    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/.test(formData.apellido_paterno_paciente)) {
      newErrors.apellido_paterno_paciente = 'El apellido paterno del paciente debe contener solo letras y espacios.';
    }

    // Apellido Materno del Paciente
    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/.test(formData.apellido_materno_paciente)) {
      newErrors.apellido_materno_paciente = 'El apellido materno del paciente debe contener solo letras y espacios.';
    }

    // Especialidad Médica que Envía
    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/.test(formData.especialidad_medica)) {
      newErrors.especialidad_medica = 'La especialidad médica debe contener solo letras y espacios.';
    }

    // Médico que Refiere
    if (formData.id_medico_refiere === '') {
      newErrors.id_medico_refiere = 'Debe seleccionar un médico que refiere.';
    }

    // Estudio Solicitado
    if (formData.id_estudio_radiologico === '') {
      newErrors.id_estudio_radiologico = 'Debe seleccionar un estudio solicitado.';
    }

    // Unidad Médica de Procedencia
    if (!/^\d+$/.test(formData.unidad_medica_procedencia)) {
      newErrors.unidad_medica_procedencia = 'La unidad médica de procedencia debe contener solo números.';
    }

    // Diagnóstico Presuntivo
    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/.test(formData.diagnostico_presuntivo)) {
      newErrors.diagnostico_presuntivo = 'El diagnóstico presuntivo debe contener solo letras y espacios.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateFields()) {
      onSubmit(formData);
    }
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
        {errors.nss && <span className="error">{errors.nss}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="nombre_paciente">Nombre del Paciente:</label>
        <input type="text" id="nombre_paciente" name="nombre_paciente" value={formData.nombre_paciente} onChange={handleChange} required />
        {errors.nombre_paciente && <span className="error">{errors.nombre_paciente}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="apellido_paterno_paciente">Apellido Paterno del Paciente:</label>
        <input type="text" id="apellido_paterno_paciente" name="apellido_paterno_paciente" value={formData.apellido_paterno_paciente} onChange={handleChange} required />
        {errors.apellido_paterno_paciente && <span className="error">{errors.apellido_paterno_paciente}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="apellido_materno_paciente">Apellido Materno del Paciente:</label>
        <input type="text" id="apellido_materno_paciente" name="apellido_materno_paciente" value={formData.apellido_materno_paciente} onChange={handleChange} required />
        {errors.apellido_materno_paciente && <span className="error">{errors.apellido_materno_paciente}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="especialidad_medica">Especialidad Médica que Envía:</label>
        <input type="text" id="especialidad_medica" name="especialidad_medica" value={formData.especialidad_medica} onChange={handleChange} required />
        {errors.especialidad_medica && <span className="error">{errors.especialidad_medica}</span>}
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
        {errors.id_medico_refiere && <span className="error">{errors.id_medico_refiere}</span>}
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
        {errors.id_estudio_radiologico && <span className="error">{errors.id_estudio_radiologico}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="unidad_medica_procedencia">Unidad Médica de Procedencia:</label>
        <input type="text" id="unidad_medica_procedencia" name="unidad_medica_procedencia" value={formData.unidad_medica_procedencia} onChange={handleChange} required />
        {errors.unidad_medica_procedencia && <span className="error">{errors.unidad_medica_procedencia}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="diagnostico_presuntivo">Diagnóstico Presuntivo:</label>
        <input type="text" id="diagnostico_presuntivo" name="diagnostico_presuntivo" value={formData.diagnostico_presuntivo} onChange={handleChange} required />
        {errors.diagnostico_presuntivo && <span className="error">{errors.diagnostico_presuntivo}</span>}
      </div>
      <div className="form-actions">
        <button type="submit">Enviar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default FormularioPaciente;

