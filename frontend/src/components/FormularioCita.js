import React, { useState, useEffect } from 'react';

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
        <form onSubmit={handleSubmit}>
            <input type="datetime-local" name="fecha_hora_cita" value={formData.fecha_hora_cita} onChange={handleChange} required />
            <input type="text" name="nss_paciente" value={formData.nss_paciente} onChange={handleChange} required />
            <input type="number" name="id_medico_refiere" value={formData.id_medico_refiere} onChange={handleChange} required />
            <input type="number" name="id_estudio_radiologico" value={formData.id_estudio_radiologico} onChange={handleChange} required />
            <input type="number" name="id_usuario_registra" value={formData.id_usuario_registra} onChange={handleChange} required />
            <input type="number" name="id_unidad_medica_origen" value={formData.id_unidad_medica_origen} onChange={handleChange} required />
            <input type="number" name="id_hospital_origen" value={formData.id_hospital_origen} onChange={handleChange} required />
            <input type="number" name="id_operador" value={formData.id_operador} onChange={handleChange} required />
            <button type="submit">{modo === 'crear' ? 'Crear Cita' : 'Actualizar Cita'}</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
    );
};

export default FormularioCita;