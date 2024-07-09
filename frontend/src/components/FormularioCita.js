import React, { useState, useEffect } from 'react';
import './FormularioCita.css';

const FormularioCita = ({ modo, citaInicial, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        fecha_hora_cita: '',
        nss_paciente: '',
        id_medico_refiere: '',
        id_estudio_radiologico: '',
        id_usuario_registra: '',
        id_unidad_medica_origen: '',
        id_hospital_origen: '',
        id_operador: ''
    });

    useEffect(() => {
        if (modo === 'editar' && citaInicial) {
            setFormData(citaInicial);
        }
    }, [modo, citaInicial]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className="form-cita" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="fecha_hora_cita">Fecha y Hora de la Cita:</label>
                <input type="datetime-local" id="fecha_hora_cita" name="fecha_hora_cita" value={formData.fecha_hora_cita} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="nss_paciente">NSS del Paciente:</label>
                <input type="text" id="nss_paciente" name="nss_paciente" value={formData.nss_paciente} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="id_medico_refiere">ID del Médico que Refiere:</label>
                <input type="number" id="id_medico_refiere" name="id_medico_refiere" value={formData.id_medico_refiere} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="id_estudio_radiologico">ID del Estudio Radiológico:</label>
                <input type="number" id="id_estudio_radiologico" name="id_estudio_radiologico" value={formData.id_estudio_radiologico} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="id_usuario_registra">ID del Usuario que Registra:</label>
                <input type="number" id="id_usuario_registra" name="id_usuario_registra" value={formData.id_usuario_registra} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="id_unidad_medica_origen">ID de la Unidad Médica de Origen:</label>
                <input type="number" id="id_unidad_medica_origen" name="id_unidad_medica_origen" value={formData.id_unidad_medica_origen} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="id_hospital_origen">ID del Hospital de Origen:</label>
                <input type="number" id="id_hospital_origen" name="id_hospital_origen" value={formData.id_hospital_origen} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="id_operador">ID del Operador:</label>
                <input type="number" id="id_operador" name="id_operador" value={formData.id_operador} onChange={handleChange} required />
            </div>
            <div className="form-actions">
                <button type="submit">{modo === 'crear' ? 'Crear Cita' : 'Actualizar Cita'}</button>
                <button type="button" onClick={onCancel}>Cancelar</button>
            </div>
        </form>
    );
};

export default FormularioCita;
