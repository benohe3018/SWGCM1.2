import axios from 'axios';

const API_URL = '/api/citas';

export const getCitas = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createCita = async (cita) => {
    const response = await axios.post(API_URL, cita);
    return response.data;
};

export const updateCita = async (id, cita) => {
    const response = await axios.put(`${API_URL}/${id}`, cita);
    return response.data;
};

export const deleteCita = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};


