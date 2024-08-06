import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getDiagnosticos = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/diagnosticos`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los diagnósticos presuntivos:", error);
        throw error;
    }
};

export const createDiagnostico = async (diagnostico) => {
    try {
        const response = await axios.post(`${API_URL}/api/diagnosticos`, diagnostico);
        return response.data;
    } catch (error) {
        console.error("Error al crear el diagnóstico presuntivo:", error);
        throw error;
    }
};

export const updateDiagnostico = async (id, diagnostico) => {
    try {
        const response = await axios.put(`${API_URL}/api/diagnosticos/${id}`, diagnostico);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el diagnóstico presuntivo:", error);
        throw error;
    }
};

export const deleteDiagnostico = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/api/diagnosticos/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el diagnóstico presuntivo:", error);
        throw error;
    }
};
