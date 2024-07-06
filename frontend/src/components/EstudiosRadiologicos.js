import React, { useState, useEffect } from "react";
import './EstudiosRadiologicos.css';
import logoIMSS from '../images/LogoIMSS.jpg';
import TablaEstudios from './TablaEstudios';
import FormularioEstudio from './FormularioEstudio';
import ModalConfirmacion from './ModalConfirmacion';
import { getEstudios, createEstudio, updateEstudio, deleteEstudio } from './estudiosService';

const EstudiosRadiologicos = () => {
    const [estudios, setEstudios] = useState([]);
    const [estudioSeleccionado, setEstudioSeleccionado] = useState(null);
    const [modoFormulario, setModoFormulario] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        inicializarEstudios();
    }, []);

    const inicializarEstudios = async () => {
        try {
            setCargando(true);
            const data = await getEstudios();
            if (data.length === 0) {
                await crearEstudiosPrueba();
            } else {
                setEstudios(data);
            }
            setError(null);
        } catch (error) {
            console.error("Error al inicializar estudios:", error);
            setError("Hubo un problema al cargar los estudios. Por favor, intente de nuevo.");
        } finally {
            setCargando(false);
        }
    };

    const crearEstudiosPrueba = async () => {
        const estudiosPrueba = [
            { nombre_estudio: "Resonancia Magnética de Cerebro", descripcion_estudio: "Estudio de imagen detallado del cerebro" },
            { nombre_estudio: "Tomografía Computarizada de Tórax", descripcion_estudio: "Imagen de rayos X del pecho" },
            { nombre_estudio: "Radiografía de Tórax", descripcion_estudio: "Imagen simple de rayos X del pecho" },
            { nombre_estudio: "Ultrasonido Abdominal", descripcion_estudio: "Estudio de imagen del abdomen usando ondas sonoras" },
            { nombre_estudio: "Mamografía", descripcion_estudio: "Imagen de rayos X de las mamas" }
        ];

        for (let estudio of estudiosPrueba) {
            try {
                await createEstudio(estudio);
            } catch (error) {
                console.error("Error al crear estudio de prueba:", error);
            }
        }

        const nuevosEstudios = await getEstudios();
        setEstudios(nuevosEstudios);
    };

    const cargarEstudios = async () => {
        try {
            setCargando(true);
            const data = await getEstudios();
            setEstudios(data);
            setError(null);
        } catch (error) {
            console.error("Error al cargar estudios:", error);
            setError("Hubo un problema al cargar los estudios. Por favor, intente de nuevo.");
        } finally {
            setCargando(false);
        }
    };

    const handleCrearEstudio = async (nuevoEstudio) => {
        try {
            await createEstudio(nuevoEstudio);
            await cargarEstudios();
            setModoFormulario('');
        } catch (error) {
            console.error("Error al crear estudio:", error);
            setError("No se pudo crear el estudio. Por favor, intente de nuevo.");
        }
    };

    const handleEditarEstudio = async (estudioEditado) => {
        try {
            await updateEstudio(estudioEditado.id, estudioEditado); // Asegúrate de usar 'id'
            await cargarEstudios();
            setModoFormulario('');
            setEstudioSeleccionado(null);
        } catch (error) {
            console.error("Error al editar estudio:", error);
            setError("No se pudo editar el estudio. Por favor, intente de nuevo.");
        }
    };

    const handleEliminarEstudio = (id) => {
        const estudio = estudios.find(e => e.id === id); // Asegúrate de usar 'id'
        if (estudio) {
            setEstudioSeleccionado(estudio);
            setMostrarModal(true);
        }
    };

    const confirmarEliminarEstudio = async () => {
        try {
            await deleteEstudio(estudioSeleccionado.id); // Asegúrate de usar 'id'
            await cargarEstudios();
            setMostrarModal(false);
            setEstudioSeleccionado(null);
        } catch (error) {
            console.error("Error al eliminar estudio:", error);
            setError("No se pudo eliminar el estudio. Por favor, intente de nuevo.");
        }
    };

    if (cargando) {
        return <div>Cargando estudios...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="estudios-radiologicos-container">
            <header className="estudios-radiologicos-header">
                <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
                <h1>Sistema de Gestión de Estudios Radiológicos</h1>
                <h2>Departamento de Resonancia Magnética - HGR #46</h2>
            </header>

            <main className="estudios-radiologicos-main">
                <button onClick={() => setModoFormulario('crear')}>Crear Nuevo Estudio</button>
                
                {modoFormulario && (
                    <FormularioEstudio
                        modo={modoFormulario}
                        estudioInicial={estudioSeleccionado}
                        onSubmit={modoFormulario === 'crear' ? handleCrearEstudio : handleEditarEstudio}
                        onCancel={() => {
                            setModoFormulario('');
                            setEstudioSeleccionado(null);
                        }}
                    />
                )}

                {estudios.length > 0 ? (
                    <TablaEstudios
                        estudios={estudios}
                        onEditar={(id) => {
                            setEstudioSeleccionado(estudios.find(e => e.id === id)); // Asegúrate de usar 'id'
                            setModoFormulario('editar');
                        }}
                        onEliminar={handleEliminarEstudio}
                    />
                ) : (
                    <p>No hay estudios disponibles.</p>
                )}
            </main>

            <ModalConfirmacion
                isOpen={mostrarModal}
                onClose={() => setMostrarModal(false)}
                onConfirm={confirmarEliminarEstudio}
                mensaje="¿Está seguro de que desea eliminar este estudio?"
            />
        </div>
    );
};

export default EstudiosRadiologicos;
