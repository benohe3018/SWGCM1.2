//EstudiosRadiologicos.js
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
    const [modoFormulario, setModoFormulario] = useState(''); // 'crear' o 'editar'
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        cargarEstudios();
    }, []);

    const cargarEstudios = async () => {
        try {
            const data = await getEstudios();
            setEstudios(data);
        } catch (error) {
            console.error("Error al cargar estudios:", error);
        }
    };

    const handleCrearEstudio = async (nuevoEstudio) => {
        try {
            await createEstudio(nuevoEstudio);
            cargarEstudios();
            setModoFormulario('');
        } catch (error) {
            console.error("Error al crear estudio:", error);
        }
    };

    const handleEditarEstudio = async (estudioEditado) => {
        try {
            await updateEstudio(estudioEditado.id_estudio, estudioEditado);
            cargarEstudios();
            setModoFormulario('');
            setEstudioSeleccionado(null);
        } catch (error) {
            console.error("Error al editar estudio:", error);
        }
    };

    const handleEliminarEstudio = async (id) => {
        setEstudioSeleccionado(estudios.find(e => e.id_estudio === id));
        setMostrarModal(true);
    };

    const confirmarEliminarEstudio = async () => {
        try {
            await deleteEstudio(estudioSeleccionado.id_estudio);
            cargarEstudios();
            setMostrarModal(false);
            setEstudioSeleccionado(null);
        } catch (error) {
            console.error("Error al eliminar estudio:", error);
        }
    };

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

                <TablaEstudios
                    estudios={estudios}
                    onEditar={(id) => {
                        setEstudioSeleccionado(estudios.find(e => e.id_estudio === id));
                        setModoFormulario('editar');
                    }}
                    onEliminar={handleEliminarEstudio}
                />
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