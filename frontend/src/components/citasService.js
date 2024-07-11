import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getCitas = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/citas`);
    return response.data;
  } catch (error) {
    console.error('Error fetching citas:', error);
    throw error;
  }
};

export const createCita = async (citaData) => {
  try {
    const response = await axios.post(`${API_URL}/api/citas`, citaData);
    return response.data;
  } catch (error) {
    console.error('Error creating cita:', error);
    throw error;
  }
};

export const updateCita = async (id, citaData) => {
  try {
    const response = await axios.put(`${API_URL}/api/citas/${id}`, citaData);
    return response.data;
  } catch (error) {
    console.error('Error updating cita:', error);
    throw error;
  }
};

export const deleteCita = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/api/citas/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting cita:', error);
    throw error;
  }
};

// Nuevas funciones para manejar la tabla pacientes_prueba
export const createPacientePrueba = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/api/pacientes_prueba`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating paciente_prueba:', error);
    throw error;
  }
};


