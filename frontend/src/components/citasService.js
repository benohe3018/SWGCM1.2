// citasService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Función para obtener todos los pacientes de prueba
export const getPacientesPrueba = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/pacientes_prueba`);
    console.log('Datos recibidos:', response.data); // Agrega este log para verificar los datos recibidos
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
  console.log('La URL de eliminación del registro es:', url);  // Agrega este log
  try {
    const response = await axios.delete(url);
    console.log('Respuesta del servidor:', response);  // Agrega este log
    return response.data;
  } catch (error) {
    console.error('Error completo:', error);  // Modifica este log
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

// Función para obtener la lista de especialidades médicas
export const getEspecialidadesMedicas = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/especialidades/list`);
    return response.data;
  } catch (error) {
    console.error('Error fetching especialidades_medicas:', error);
    throw error;
  }
};

// Función para obtener la lista de unidades médicas
export const getUnidadesMedicas = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/unidades/list`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unidades_medicas:', error);
    throw error;
  }
};

// Función para obtener la lista de diagnósticos presuntivos
export const getDiagnosticosPresuntivos = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/diagnosticos/list`);
    return response.data;
  } catch (error) {
    console.error('Error fetching diagnosticos_presuntivos:', error);
    throw error;
  }
};

// Función para obtener la lista de hospitales
export const getHospitales = async () => {
  try {
      const response = await axios.get(`${API_URL}/api/hospitales`); // Verifica que la ruta sea correcta
      return response.data;
  } catch (error) {
      console.error('Error fetching hospitals:', error);
      throw error;
  }
};
export const getCitasPorFecha = async (fecha) => {
  try {
    const response = await axios.get(`${API_URL}/api/citas`, {
      params: { fecha },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching citas:', error);
    throw error;
  }
};

// Función para verificar disponibilidad de horario
export const verificarDisponibilidadHorario = async (fecha, hora) => {
  try {
    const citas = await getCitasPorFecha(fecha);
    const horariosOcupados = citas.map(cita => cita.fecha_hora_estudio);
    const horarioSeleccionado = `${fecha}T${hora}`;
    return !horariosOcupados.includes(horarioSeleccionado);
  } catch (error) {
    console.error('Error verifying availability:', error);
    throw error;
  }
};