import axios from 'axios';

const API_URL = '/api';

export const getEstudios = async () => {
  try {
    const response = await axios.get(`${API_URL}/estudios`);
    return response.data;
  } catch (error) {
    console.error('Error fetching estudios:', error);
    throw error;
  }
};

export const createEstudio = async (estudioData) => {
  try {
    const response = await axios.post(`${API_URL}/estudios`, estudioData);
    return response.data;
  } catch (error) {
    console.error('Error creating estudio:', error);
    throw error;
  }
};

export const updateEstudio = async (id, estudioData) => {
  try {
    const response = await axios.put(`${API_URL}/estudios/${id}`, estudioData);
    return response.data;
  } catch (error) {
    console.error('Error updating estudio:', error);
    throw error;
  }
};

export const deleteEstudio = async (id) => {
  const response = await fetch(`/api/estudios/${id}`, {
      method: 'DELETE'
  });
  if (!response.ok) {
      throw new Error('No se pudo eliminar el estudio');
  }
  return response.json();
};
