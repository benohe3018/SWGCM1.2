import React, { useState, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import './GestionCitas.css';
import logoIMSS from '../images/LogoIMSS.jpg';
import { getCitas, createPacientePrueba, updateCita, deleteCita, getMedicos, getEstudios, getPacientesPrueba } from './citasService';
import FormularioCita from './FormularioCita';
import ModalConfirmacion from './ModalConfirmacion'; 
import mrMachine from '../images/MRMachine.jpg';

const GestionCitas = () => {
    const [citas, setCitas] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [estudios, setEstudios] = useState([]);
    const [pacientesPrueba, setPacientesPrueba] = useState([]); // Aquí está el estado que mencionas
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState(null); 
    const [cargando, setCargando] = useState(true);
    const [vista, setVista] = useState('');

    const inicializarCitas = useCallback(async () => {
        try {
            setCargando(true);
            const [citasData, medicosData, estudiosData, pacientesPruebaData] = await Promise.all([
                getCitas(),
                getMedicos(),
                getEstudios(),
                getPacientesPrueba() // Obtener datos de pacientes de prueba
            ]);
            citasData.sort((a, b) => a.id - b.id); 
            setCitas(citasData);
            setMedicos(medicosData);
            setEstudios(estudiosData);
            setPacientesPrueba(pacientesPruebaData); // Asignar datos obtenidos al estado
            setError(null);
        } catch (error) {
            console.error("Error al inicializar datos:", error);
            setError("Hubo un problema al cargar los datos. Por favor, intente de nuevo.");
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        inicializarCitas();
    }, [inicializarCitas]);

    const cargarCitas = async () => {
        try {
            setCargando(true);
            const data = await getCitas();
            data.sort((a, b) => a.id - b.id); 
            setCitas(data);
            setError(null);
        } catch (error) {
            console.error("Error al cargar citas:", error);
            setError("Hubo un problema al cargar las citas. Por favor, intente de nuevo.");
        } finally {
            setCargando(false);
        }
    };

    const handleCrearCita = async (datosPaciente) => {
        try {
            await createPacientePrueba(datosPaciente);
            await cargarCitas();
            setVista(''); 
            setMensaje('Cita creada exitosamente.');
            setTimeout(() => setMensaje(null), 3000);
        } catch (error) {
            console.error("Error al crear cita:", error);
            setError("No se pudo crear la cita. Por favor, intente de nuevo.");
        }
    };

    const handleEditarCita = async (citaEditada) => {
        try {
            if (!citaEditada.id) {
                throw new Error("El ID de la cita no está definido");
            }
            console.log("Editando cita con ID:", citaEditada.id); 
            await updateCita(citaEditada.id, citaEditada);
            await cargarCitas();
            setCitaSeleccionada(null);
            setVista('ver'); 
            setMensaje('Cita actualizada exitosamente.'); 
            setTimeout(() => setMensaje(null), 3000); 
        } catch (error) {
            console.error("Error al editar cita:", error);
            setError("No se pudo editar la cita. Por favor, intente de nuevo.");
        }
    };

    const handleEliminarCita = (id) => {
        const cita = citas.find(e => e.id === id);
        if (cita) {
            setCitaSeleccionada(cita);
            setMostrarModal(true);
            console.log("Seleccionado para eliminar:", cita.id);
        }
    };

    const confirmarEliminarCita = async () => {
        try {
            console.log("Confirmando eliminación de cita con ID:", citaSeleccionada.id);
            await deleteCita(citaSeleccionada.id);
            await cargarCitas();
            setMostrarModal(false);
            setCitaSeleccionada(null);
            setMensaje('Cita eliminada exitosamente.');
            setTimeout(() => setMensaje(null), 3000);
        } catch (error) {
            console.error("Error al eliminar cita:", error);
            setError("No se pudo eliminar la cita. Por favor, intente de nuevo.");
        }
    };

    if (cargando) {
        return <div>Cargando citas...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="gestion-citas-page">
            <header className="gestion-citas-header">
                <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
                <div className="header-texts">
                    <h1 className="welcome-message">Sistema de Gestión de Citas Médicas</h1>
                    <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
                </div>
            </header>

            <nav className="navbar">
                <ul className="nav-links">
                    <li><Link to="/" onClick={() => setVista('')}>Cambiar Sesión</Link></li>
                    <li><Link to="#" onClick={() => setVista('crear')}>Capturar Nueva Cita Médica</Link></li>
                    <li><Link to="#" onClick={() => setVista('ver')}>Ver Citas Capturadas</Link></li>
                    <li><Link to="/dashboard-root">Página de Inicio</Link></li>
                </ul>
                <div className="hamburger">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
            </nav>
            {vista === '' && <img src={mrMachine} alt="Máquina de resonancia magnética" className="mr-machine" />}      
            <div className="gestion-citas-content">
                {mensaje && <div className="mensaje-confirmacion">{mensaje}</div>}
                {vista === 'crear' && (
                    <FormularioCita
                        modo="crear"
                        medicos={medicos}
                        estudios={estudios}
                        onSubmit={handleCrearCita}
                        onCancel={() => setVista('')}
                    />
                )}

                {vista === 'ver' && (
                    <div className="tabla-citas-container">
                        <table className="tabla-citas">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha y Hora</th>
                                    <th>Paciente</th>
                                    <th>Médico</th>
                                    <th>Estudio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pacientesPrueba.map((paciente) => (
                                    <tr key={paciente.id}>
                                        <td>{paciente.id}</td>
                                        <td>{paciente.fecha_hora_estudio}</td>
                                        <td>{paciente.nombre_paciente}</td>
                                        <td>{paciente.nombre_completo_medico}</td>
                                        <td>{paciente.estudio_solicitado}</td>
                                        <td>
                                            <div className="botones-acciones">
                                                <button 
                                                  onClick={() => {
                                                      setCitaSeleccionada(paciente);
                                                      setVista('editar');
                                                  }} 
                                                  className="editar-button"
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                  onClick={() => handleEliminarCita(paciente.id)} 
                                                  className="eliminar-button"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {vista === 'editar' && citaSeleccionada && (
                    <FormularioCita
                        modo="editar"
                        citaInicial={citaSeleccionada}
                        medicos={medicos}
                        estudios={estudios}
                        onSubmit={handleEditarCita}
                        onCancel={() => setVista('')}
                    />
                )}
            </div>
            {mostrarModal && (
                <ModalConfirmacion
                    mensaje="¿Estás seguro de que deseas eliminar esta cita?"
                    onConfirm={confirmarEliminarCita}
                    onCancel={() => setMostrarModal(false)}
                />
            )}
        </div>
    );
};

export default GestionCitas;








