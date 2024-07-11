import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FormularioCita.css';

const FormularioCita = ({ modo, citaInicial, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fecha_hora_estudio: '', // Nuevo campo para la fecha y hora del estudio
    nss_paciente: '',
    nombre_paciente: '',
    apellido_paterno_paciente: '',
    apellido_materno_paciente: '',
    especialidad_medica_envia: '',
    id_medico_refiere: '',
    id_estudio_radiologico: '',
    unidad_medica_procedencia: '',
    diagnostico_presuntivo: ''
  });
  const [medicos, setMedicos] = useState([]);
  const [estudios, setEstudios] = useState([]);

  useEffect(() => {
    if (modo === 'editar' && citaInicial) {
      setFormData(citaInicial);
    }
  }, [modo, citaInicial]);

  useEffect(() => {
    const fetchMedicos = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/medicos/list`);
      setMedicos(response.data);
    };

    const fetchEstudios = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/estudios/list`);
      setEstudios(response.data);
    };

    fetchMedicos();
    fetchEstudios();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Enviar formData sin encriptar
  };

  return (
    <form className="form-cita" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="fecha_hora_estudio">Fecha y Hora del Estudio:</label>
        <input type="datetime-local" id="fecha_hora_estudio" name="fecha_hora_estudio" value={formData.fecha_hora_estudio} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="nss_paciente">NSS del Paciente:</label>
        <input type="text" id="nss_paciente" name="nss_paciente" value={formData.nss_paciente} onChange={handleChange} required />
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
        <label htmlFor="especialidad_medica_envia">Especialidad Médica que Envía:</label>
        <input type="text" id="especialidad_medica_envia" name="especialidad_medica_envia" value={formData.especialidad_medica_envia} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="id_medico_refiere">Médico que Refiere:</label>
        <select id="id_medico_refiere" name="id_medico_refiere" value={formData.id_medico_refiere} onChange={handleChange} required>
          <option value="">Seleccione un Médico</option>
          {medicos.map((medico) => (
            <option key={medico.id_medico} value={medico.id_medico}>
              {`${medico.nombre} ${medico.apellido_paterno} ${medico.apellido_materno}`}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="id_estudio_radiologico">Estudio Solicitado:</label>
        <select id="id_estudio_radiologico" name="id_estudio_radiologico" value={formData.id_estudio_radiologico} onChange={handleChange} required>
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

export default FormularioCita;

