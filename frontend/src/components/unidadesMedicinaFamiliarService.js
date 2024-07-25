import axios from 'axios';

const API_URL = '/api';

export const getUnidades = async () => {
  try {
    const response = await axios.get(`${API_URL}/unidades_medicina_familiar`);
    return response.data;
  } catch (error) {
    console.error('Error fetching units:', error);
    throw error;
  }
};

export const createUnidad = async (unidad) => {
  try {
    const response = await axios.post(`${API_URL}/unidades_medicina_familiar`, unidad);
    return response.data;
  } catch (error) {
    console.error('Error creating unit:', error);
    throw error;
  }
};

export const updateUnidad = async (id, unidad) => {
  try {
    const response = await axios.put(`${API_URL}/unidades_medicina_familiar/${id}`, unidad);
    return response.data;
  } catch (error) {
    console.error('Error updating unit:', error);
    throw error;
  }
};

export const deleteUnidad = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/unidades_medicina_familiar/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};
