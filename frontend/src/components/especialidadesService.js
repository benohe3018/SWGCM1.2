// src/services/especialidadesService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; 

export const getEspecialidades = async () => {
    try {
        const response = await axios.get(`${API_URL}/especialidades`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las especialidades médicas:", error);
        throw error;
    }
};

export const createEspecialidad = async (especialidad) => {
    try {
        const response = await axios.post(`${API_URL}/especialidades`, especialidad);
        return response.data;
    } catch (error) {
        console.error("Error al crear la especialidad médica:", error);
        throw error;
    }
};

export const updateEspecialidad = async (id, especialidad) => {
    try {
        const response = await axios.put(`${API_URL}/especialidades/${id}`, especialidad);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar la especialidad médica:", error);
        throw error;
    }
};

export const deleteEspecialidad = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/especialidades/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar la especialidad médica:", error);
        throw error;
    }
};
