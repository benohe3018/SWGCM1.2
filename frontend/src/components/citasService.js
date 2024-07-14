import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Función para obtener todas las citas
export const getCitas = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/citas`);
    return response.data;
  } catch (error) {
    console.error('Error fetching citas:', error);
    throw error;
  }
};

// Función para crear una nueva cita
export const createCita = async (citaData) => {
  try {
    const response = await axios.post(`${API_URL}/api/citas`, citaData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating cita:', error);
    throw error;
  }
};

// Función para actualizar una cita existente
export const updateCita = async (id, citaData) => {
  try {
    const response = await axios.put(`${API_URL}/api/pacientes_prueba/${id}`, citaData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating cita:', error);
    throw error;
  }
};

// Función para eliminar una cita existente
export const deletePacientePrueba = async (id) => {
  const url = `${API_URL}/api/pacientes_prueba/${id}`;
  console.log('URL de eliminación:', url);
  try {
    console.log('Intentando eliminar paciente con ID:', id);
    const response = await axios.delete(url);
    console.log('Respuesta de eliminación:', response.data);
    if (response.status !== 200) {
      throw new Error('No se pudo eliminar el paciente de prueba');
    }
    return response.data;
  } catch (error) {
    console.error('Error completo al eliminar paciente:', error);
    console.error('Mensaje de error:', error.message);
    if (error.response) {
      console.error('Datos de respuesta de error:', error.response.data);
      console.error('Estado de respuesta de error:', error.response.status);
      console.error('Cabeceras de respuesta de error:', error.response.headers);
    }
    throw error;
  }
};

// Función para crear un nuevo paciente de prueba
export const createPacientePrueba = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/api/pacientes_prueba`, data, {
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

// Función para obtener la lista de pacientes de prueba
export const getPacientesPrueba = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/pacientes_prueba`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pacientes_prueba:', error);
    throw error;
  }
};





