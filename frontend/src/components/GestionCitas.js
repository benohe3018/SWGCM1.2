import React, { useState, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import './GestionCitas.css';
import logoIMSS from '../images/LogoIMSS.jpg';
import { getPacientesPrueba, createPacientePrueba, updatePacientePrueba, deletePacientePrueba, getMedicos, getEstudios } from './citasService';
import FormularioPaciente from './FormularioPaciente';
import ModalConfirmacion from './ModalConfirmacion';
import mrMachine from '../images/MRMachine.jpg';

const GestionCitas = () => {
    const [pacientesPrueba, setPacientesPrueba] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [estudios, setEstudios] = useState([]);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState(null); 
    const [cargando, setCargando] = useState(true);
    const [vista, setVista] = useState('');

    const inicializarDatos = useCallback(async () => {
        try {
            setCargando(true);
            const [pacientesData, medicosData, estudiosData] = await Promise.all([
                getPacientesPrueba(),
                getMedicos(),
                getEstudios()
            ]);
            pacientesData.sort((a, b) => a.id - b.id); 
            setPacientesPrueba(pacientesData);
            setMedicos(medicosData);
            setEstudios(estudiosData);
            setError(null);
        } catch (error) {
            console.error("Error al inicializar datos:", error);
            setError("Hubo un problema al cargar los datos. Por favor, intente de nuevo.");
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        inicializarDatos();
    }, [inicializarDatos]);

    const cargarPacientesPrueba = async () => {
        try {
            setCargando(true);
            const data = await getPacientesPrueba();
            console.log("Pacientes de prueba cargados:", data);
            data.sort((a, b) => a.id - b.id); 
            setPacientesPrueba(data);
            setError(null);
        } catch (error) {
            console.error("Error al cargar pacientes de prueba:", error);
            setError("Hubo un problema al cargar los pacientes de prueba. Por favor, intente de nuevo.");
        } finally {
            setCargando(false);
        }
    };

    const handleCrearPaciente = async (datosPaciente) => {
        try {
            await createPacientePrueba(datosPaciente);
            await cargarPacientesPrueba();
            setVista('ver'); 
            setMensaje('Paciente de prueba creado exitosamente.');
            setTimeout(() => setMensaje(null), 3000);
        } catch (error) {
            console.error("Error al crear paciente de prueba:", error);
            setError("No se pudo crear el paciente de prueba. Por favor, intente de nuevo.");
        }
    };

    const handleEditarPaciente = async (pacienteEditado) => {
        try {
            if (!pacienteEditado.id) {
                throw new Error("El ID del paciente no está definido");
            }
            console.log("Editando paciente con ID:", pacienteEditado.id); 
            await updatePacientePrueba(pacienteEditado.id, pacienteEditado);
            await cargarPacientesPrueba();
            setPacienteSeleccionado(null);
            setVista('ver'); 
            setMensaje('Paciente actualizado exitosamente.'); 
            setTimeout(() => setMensaje(null), 3000); 
        } catch (error) {
            console.error("Error al editar paciente:", error);
            setError("No se pudo editar el paciente. Por favor, intente de nuevo.");
        }
    };

    const handleEliminarPaciente = (id) => {
        const numericId = Number(id);
        console.log("Iniciando proceso de eliminación para ID:", numericId);
        console.log("Todos los pacientes de prueba:", pacientesPrueba);
        const paciente = pacientesPrueba.find(p => p.id === numericId);
        if (paciente) {
            console.log("Paciente encontrado:", paciente);
            setPacienteSeleccionado(paciente);
            setMostrarModal(true);
        } else {
            console.log("No se encontró el paciente con ID:", numericId);
            console.log("IDs de pacientes disponibles:", pacientesPrueba.map(p => p.id));
        }
    };

    const confirmarEliminarPaciente = async () => {
        try {
            console.log("Intentando eliminar paciente con ID:", pacienteSeleccionado.id);
            await deletePacientePrueba(pacienteSeleccionado.id);
            console.log("Paciente eliminado exitosamente");
            await cargarPacientesPrueba();
            setMostrarModal(false);
            setPacienteSeleccionado(null);
            setMensaje('Paciente eliminado exitosamente.');
            setTimeout(() => setMensaje(null), 3000);
        } catch (error) {
            console.error("Error al eliminar paciente:", error);
            setError("No se pudo eliminar el paciente. Por favor, intente de nuevo.");
        }
    };

    if (cargando) {
        return <div>Cargando datos...</div>;
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
                    <li><Link to="#" onClick={() => setVista('crear')}>Capturar Nuevo Paciente de Prueba</Link></li>
                    <li><Link to="#" onClick={() => setVista('ver')}>Ver Pacientes de Prueba</Link></li>
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
                    <FormularioPaciente
                        modo="crear"
                        medicos={medicos}
                        estudios={estudios}
                        onSubmit={handleCrearPaciente}
                        onCancel={() => setVista('ver')}
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
                                                      setPacienteSeleccionado(paciente);
                                                      setVista('editar');
                                                  }} 
                                                  className="editar-button"
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                  onClick={() => handleEliminarPaciente(paciente.id)} 
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
                {vista === 'editar' && pacienteSeleccionado && (
                    <FormularioPaciente
                        modo="editar"
                        pacienteInicial={pacienteSeleccionado}
                        medicos={medicos}
                        estudios={estudios}
                        onSubmit={handleEditarPaciente}
                        onCancel={() => setVista('ver')}
                    />
                )}
            </div>
            {mostrarModal && (
                <ModalConfirmacion
                    mensaje="¿Estás seguro de que deseas eliminar este paciente de prueba?"
                    onConfirm={confirmarEliminarPaciente}
                    onCancel={() => setMostrarModal(false)}
                />
            )}
        </div>
    );
};

export default GestionCitas;










