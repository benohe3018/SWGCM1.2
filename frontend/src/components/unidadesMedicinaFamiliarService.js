// src/services/unidadesMedicinaFamiliarService.js

import axios from 'axios';

const API_URL = '/api/unidades_medicina_familiar';

export const getUnidades = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createUnidad = async (unidad) => {
  const response = await axios.post(API_URL, unidad);
  return response.data;
};

export const updateUnidad = async (id, unidad) => {
  const response = await axios.put(`${API_URL}/${id}`, unidad);
  return response.data;
};

export const deleteUnidad = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
