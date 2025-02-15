import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; 

export const getHospitales = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/hospitales`); // Verifica que la ruta sea correcta
        return response.data;
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        throw error;
    }
};

export const createHospital = async (hospital) => {
    try {
        const response = await axios.post(`${API_URL}/api/hospitales`, hospital);
        return response.data;
    } catch (error) {
        console.error('Error creating hospital:', error);
        throw error;
    }
};

export const updateHospital = async (id, hospital) => {
    try {
        const response = await axios.put(`${API_URL}/api/hospitales/${id}`, hospital);
        return response.data;
    } catch (error) {
        console.error('Error updating hospital:', error);
        throw error;
    }
};

export const deleteHospital = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/api/hospitales/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting hospital:', error);
        throw error;
    }
};
