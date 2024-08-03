// citasService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Función para obtener todos los pacientes de prueba
export const getPacientesPrueba = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/pacientes_prueba`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pacientes_prueba:', error);
    throw error;
  }
};

// Función para crear un nuevo paciente de prueba
export const createPacientePrueba = async (pacienteData) => {
  try {
    const response = await axios.post(`${API_URL}/api/pacientes_prueba`, pacienteData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating paciente_prueba:', error);
    throw error;
  }
};

// Función para actualizar un paciente de prueba existente
export const updatePacientePrueba = async (id, pacienteData) => {
  try {
    const response = await axios.put(`${API_URL}/api/pacientes_prueba/${id}`, pacienteData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating paciente_prueba:', error);
    throw error;
  }
};

// Función para eliminar un paciente de prueba existente
export const deletePacientePrueba = async (id) => {
  const url = `${API_URL}/api/pacientes_prueba/${id}`;
  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error('Error deleting paciente_prueba:', error);
    throw error;
  }
};

// Función para obtener la lista de médicos
export const getMedicos = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/medicos/list`);
    return response.data;
  } catch (error) {
    console.error('Error fetching medicos:', error);
    throw error;
  }
};

// Función para obtener la lista de estudios
export const getEstudios = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/estudios/list`);
    return response.data;
  } catch (error) {
    console.error('Error fetching estudios:', error);
    throw error;
  }
};

// Función para obtener la lista de especialidades
export const getEspecialidades = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/especialidades`);
    return response.data;
  } catch (error) {
    console.error('Error fetching especialidades:', error);
    throw error;
  }
};

// Función para obtener la lista de unidades médicas
export const getUnidadesMedicas = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/unidades_medicas`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unidades_medicas:', error);
    throw error;
  }
};

// Función para obtener la lista de diagnósticos presuntivos
export const getDiagnosticosPresuntivos = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/diagnosticos_presuntivos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching diagnosticos_presuntivos:', error);
    throw error;
  }
};
