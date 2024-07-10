import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

    const [medicos, setMedicos] = useState([]);
    const [estudios, setEstudios] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [hospitales, setHospitales] = useState([]);

    useEffect(() => {
        if (modo === 'editar' && citaInicial) {
            setFormData(citaInicial);
        }
    }, [modo, citaInicial]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [medicosRes, estudiosRes, unidadesRes, hospitalesRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/api/medicos/list`),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/estudios/list`),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/unidades/list`),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/hospitales/list`)
                ]);

                setMedicos(medicosRes.data);
                setEstudios(estudiosRes.data);
                setUnidades(unidadesRes.data);
                setHospitales(hospitalesRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

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
                <label htmlFor="id_medico_refiere">Médico que Refiere:</label>
                <select id="id_medico_refiere" name="id_medico_refiere" value={formData.id_medico_refiere} onChange={handleChange} required>
                    <option value="">Seleccione un médico</option>
                    {medicos.map(medico => (
                        <option key={medico.id_medico} value={medico.id_medico}>{medico.nombre_medico}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="id_estudio_radiologico">Estudio Radiológico:</label>
                <select id="id_estudio_radiologico" name="id_estudio_radiologico" value={formData.id_estudio_radiologico} onChange={handleChange} required>
                    <option value="">Seleccione un estudio</option>
                    {estudios.map(estudio => (
                        <option key={estudio.id_estudio} value={estudio.id_estudio}>{estudio.nombre_estudio}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="id_usuario_registra">ID del Usuario que Registra:</label>
                <input type="number" id="id_usuario_registra" name="id_usuario_registra" value={formData.id_usuario_registra} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="id_unidad_medica_origen">Unidad Médica de Origen:</label>
                <select id="id_unidad_medica_origen" name="id_unidad_medica_origen" value={formData.id_unidad_medica_origen} onChange={handleChange} required>
                    <option value="">Seleccione una unidad médica</option>
                    {unidades.map(unidad => (
                        <option key={unidad.id_unidad_medica} value={unidad.id_unidad_medica}>{unidad.nombre_unidad_medica}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="id_hospital_origen">Hospital de Origen:</label>
                <select id="id_hospital_origen" name="id_hospital_origen" value={formData.id_hospital_origen} onChange={handleChange} required>
                    <option value="">Seleccione un hospital</option>
                    {hospitales.map(hospital => (
                        <option key={hospital.id_hospital} value={hospital.id_hospital}>{hospital.nombre_hospital}</option>
                    ))}
                </select>
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

