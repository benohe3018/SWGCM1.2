import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './FormularioCita.css';

const FormularioCita = ({ modo, citaInicial, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fecha_hora_estudio: '',
    nss: '',
    nombre_paciente: '',
    apellido_paterno_paciente: '',
    apellido_materno_paciente: '',
    especialidad_medica: '',
    nombre_completo_medico: '',
    estudio_solicitado: '',
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
    const encryptedData = {
      ...formData,
      nss: CryptoJS.AES.encrypt(formData.nss, 'your-secret-key').toString(),
      nombre_paciente: CryptoJS.AES.encrypt(formData.nombre_paciente, 'your-secret-key').toString(),
      apellido_paterno_paciente: CryptoJS.AES.encrypt(formData.apellido_paterno_paciente, 'your-secret-key').toString(),
      apellido_materno_paciente: CryptoJS.AES.encrypt(formData.apellido_materno_paciente, 'your-secret-key').toString(),
      especialidad_medica: CryptoJS.AES.encrypt(formData.especialidad_medica, 'your-secret-key').toString(),
      nombre_completo_medico: CryptoJS.AES.encrypt(formData.nombre_completo_medico, 'your-secret-key').toString(),
      estudio_solicitado: CryptoJS.AES.encrypt(formData.estudio_solicitado, 'your-secret-key').toString(),
      unidad_medica_procedencia: CryptoJS.AES.encrypt(formData.unidad_medica_procedencia, 'your-secret-key').toString(),
      diagnostico_presuntivo: CryptoJS.AES.encrypt(formData.diagnostico_presuntivo, 'your-secret-key').toString()
    };
    onSubmit(encryptedData);
  };

  return (
    <form className="form-cita" onSubmit={handleSubmit}>
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
        <label htmlFor="especialidad_medica">Especialidad Médica:</label>
        <input type="text" id="especialidad_medica" name="especialidad_medica" value={formData.especialidad_medica} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="nombre_completo_medico">Nombre Completo del Médico:</label>
        <select id="nombre_completo_medico" name="nombre_completo_medico" value={formData.nombre_completo_medico} onChange={handleChange} required>
          <option value="">Seleccione un Médico</option>
          {medicos.map((medico) => (
            <option key={medico.id_medico} value={`${medico.nombre_medico} ${medico.apellido_paterno_medico} ${medico.apellido_materno_medico}`}>
              {`${medico.nombre_medico} ${medico.apellido_paterno_medico} ${medico.apellido_materno_medico}`}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="estudio_solicitado">Estudio Solicitado:</label>
        <select id="estudio_solicitado" name="estudio_solicitado" value={formData.estudio_solicitado} onChange={handleChange} required>
          <option value="">Seleccione un Estudio</option>
          {estudios.map((estudio) => (
            <option key={estudio.id_estudio} value={estudio.nombre_estudio}>
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





