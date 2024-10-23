import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import './EstudiosRadiologicos.css'; 
import logoIMSS from '../images/LogoIMSS.jpg';
import { getEstudios, createEstudio, updateEstudio, deleteEstudio } from './estudiosService';
import FormularioEstudio from './FormularioEstudio';
import ModalConfirmacion from './ModalConfirmacion';
import mrMachine from '../images/MRMachine.jpg';

const EstudiosRadiologicos = ({ vistaInicial }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [estudios, setEstudios] = useState([]);
    const [estudioSeleccionado, setEstudioSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [vista, setVista] = useState(vistaInicial || 'ver'); 
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('nombre_estudio');
    const estudiosPerPage = 10;

const handleInputChange = (e, idEstudio, field) => {
    const newEstudios = [...estudios];  // Copiamos el array de estudios
    const index = newEstudios.findIndex(est => est.id_estudio === idEstudio);  // Encontramos el índice del estudio correspondiente  
        if (index !== -1) {
            newEstudios[index][field] = e.target.value;  // Actualizamos el campo que ha cambiado
            setEstudios(newEstudios);  // Actualizamos el estado con los nuevos estudios
        }
    };

    useEffect(() => {
        if (location.pathname === '/crear-estudio') {
            setVista('crear');
        } else if (location.pathname === '/ver-estudios') {
            setVista('ver');
        } else if (location.pathname === '/update-estudio') {
            setVista('editar');
        } else if (location.pathname === '/delete-estudio') {
            setVista('eliminar');
        }
    }, [location.pathname]);

    const inicializarEstudios = useCallback(async () => {
        try {
            setCargando(true);
            const data = await getEstudios();
            data.sort((a, b) => a.id_estudio - b.id_estudio);
            setEstudios(data);
            setError(null);
        } catch (error) {
            console.error("Error al inicializar estudios:", error);
            setError("Hubo un problema al cargar los estudios. Por favor, intente de nuevo.");
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        inicializarEstudios();
    }, [inicializarEstudios]);

    const cargarEstudios = async () => {
        try {
            setCargando(true);
            const data = await getEstudios();
            data.sort((a, b) => a.id_estudio - b.id_estudio);
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
            setMensaje('Estudio creado exitosamente.');
            // Actualizar la lista de estudios inmediatamente después de crear un nuevo registro
            await cargarEstudios();
            setTimeout(() => {
                setMensaje(null);
                // Mantener al usuario en la vista "crear"
                setVista('crear');
            }, 3000); 
        } catch (error) {
            console.error("Error al crear estudio:", error);
            setError("No se pudo crear el estudio. Por favor, intente de nuevo.");
        }
    };

    const handleEditarEstudio = async (estudioEditado) => {
        try {
            if (!estudioEditado.id_estudio) {
                throw new Error("El ID del estudio no está definido");
            }
            await updateEstudio(estudioEditado.id_estudio, estudioEditado);
            await cargarEstudios();
            setEstudioSeleccionado(null);
            setMensaje('Estudio actualizado exitosamente.');
            setTimeout(() => setMensaje(null), 3000);
        } catch (error) {
            console.error("Error al editar estudio:", error);
            setError("No se pudo editar el estudio. Por favor, intente de nuevo.");
        }
    };

    const handleEliminarEstudio = (id) => {
        const estudio = estudios.find(e => e.id_estudio === id);
        if (estudio) {
            setEstudioSeleccionado(estudio);
            setMostrarModal(true);
        }
    };

    const confirmarEliminarEstudio = async () => {
        try {
            await deleteEstudio(estudioSeleccionado.id_estudio);
            await cargarEstudios();
            setMostrarModal(false);
            setEstudioSeleccionado(null);
            setMensaje('Estudio eliminado exitosamente.');
            setTimeout(() => setMensaje(null), 3000);
        } catch (error) {
            console.error("Error al eliminar estudio:", error);
            setError("No se pudo eliminar el estudio. Por favor, intente de nuevo.");
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFieldChange = (event) => {
        setSearchField(event.target.value);
    };

    const filteredEstudios = estudios.filter((estudio) => {
        if (searchField === 'nombre_estudio') {
            return estudio.nombre_estudio.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchField === 'descripcion_estudio') {
            return estudio.descripcion_estudio.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return estudio;
    });

    const indexOfLastEstudio = currentPage * estudiosPerPage;
    const indexOfFirstEstudio = indexOfLastEstudio - estudiosPerPage;
    const currentEstudios = filteredEstudios.slice(indexOfFirstEstudio, indexOfLastEstudio);

    const totalPages = Math.ceil(filteredEstudios.length / estudiosPerPage);

    if (cargando) {
        return <div>Cargando estudios...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="estudios-radiologicos">
            <header className="estudios-radiologicos__header">
                <img src={logoIMSS} alt="Logo IMSS" className="estudios-radiologicos__header-logo" />
                <div className="estudios-radiologicos__header-texts">
                    <h1 className="estudios-radiologicos__welcome-message">Sistema de Gestión de Estudios Radiológicos</h1>
                    <h2 className="estudios-radiologicos__department-name">Departamento de Resonancia Magnética - HGR #46</h2>
                </div>
            </header>
            {vista === '' && <img src={mrMachine} alt="Máquina de resonancia magnética" className="estudios-radiologicos__mr-machine" />}
            <div className="estudios-radiologicos__content">
                {mensaje && <div className="estudios-radiologicos__message-confirmation">{mensaje}</div>}
                {vista === 'crear' && (
                    <FormularioEstudio
                        modo="crear"
                        onSubmit={handleCrearEstudio}
                        onCancel={() => navigate('/ver-estudios')}
                    />
                )}
                {vista === 'ver' && (
                    <>
                        <div className="estudios-radiologicos__search-container">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="estudios-radiologicos__search-input"
                            />
                            <select value={searchField} onChange={handleFieldChange} className="estudios-radiologicos__search-select">
                                <option >Seleccione</option>
                                <option value="nombre_estudio">Nombre</option>
                                <option value="descripcion_estudio">Descripción</option>
                            </select>
                        </div>
                        <div className="estudios-radiologicos__table-container">
                            <table className="estudios-radiologicos__table">
                                <thead>
                                    <tr>
                                        <th>Nombre del Estudio</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEstudios.map((estudio) => (
                                        <tr key={estudio.id_estudio}>
                                            <td>{estudio.nombre_estudio}</td>
                                            <td>{estudio.descripcion_estudio}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="estudios-radiologicos__pagination">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`estudios-radiologicos__pagination-button ${page === currentPage ? 'active' : ''}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
                {vista === 'editar' && (
                    <>
                        <div className="estudios-radiologicos__search-container">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="estudios-radiologicos__search-input"
                            />
                            <select value={searchField} onChange={handleFieldChange} className="estudios-radiologicos__search-select">
                                <option value="nombre_estudio">Nombre del Estudio</option>
                                <option value="descripcion_estudio">Descripción del Estudio</option>
                            </select>
                        </div>
                        <div className="estudios-radiologicos__table-container">
                            <table className="estudios-radiologicos__table">
                                <thead>
                                    <tr>
                                        <th>Nombre del Estudio</th>
                                        <th>Descripción</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEstudios.map((estudio) => (
                                        <tr key={estudio.id_estudio}>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={estudio.nombre_estudio}
                                                    onChange={(e) => handleInputChange(e, estudio.id_estudio, 'nombre_estudio')}
                                                    className="estudios-radiologicos__input"
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    value={estudio.descripcion_estudio}
                                                    onChange={(e) => handleInputChange(e, estudio.id_estudio, 'descripcion_estudio')}
                                                    className="estudios-radiologicos__textarea"
                                                />
                                            </td>
                                            <td>
                                                <div className="estudios-radiologicos__actions">
                                                    <button
                                                        onClick={() => handleEditarEstudio(estudio)}
                                                        className="estudios-radiologicos__button estudios-radiologicos__button--edit"
                                                    >
                                                        Guardar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="estudios-radiologicos__pagination">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`estudios-radiologicos__pagination-button ${page === currentPage ? 'active' : ''}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
                {vista === 'eliminar' && (
                    <>
                        <div className="estudios-radiologicos__search-container">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="estudios-radiologicos__search-input"
                            />
                            <select value={searchField} onChange={handleFieldChange} className="estudios-radiologicos__search-select">
                                <option value="nombre_estudio">Nombre del Estudio</option>
                                <option value="descripcion_estudio">Descripción del Estudio</option>
                            </select>
                        </div>
                        <div className="estudios-radiologicos__table-container">
                            <table className="estudios-radiologicos__table">
                                <thead>
                                    <tr>
                                        <th>Nombre del Estudio</th>
                                        <th>Descripción</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEstudios.map((estudio) => (
                                        <tr key={estudio.id_estudio}>
                                            <td>{estudio.nombre_estudio}</td>
                                            <td>{estudio.descripcion_estudio}</td>
                                            <td>
                                                <div className="estudios-radiologicos__actions">
                                                    <button
                                                        onClick={() => handleEliminarEstudio(estudio.id_estudio)}
                                                        className="estudios-radiologicos__button estudios-radiologicos__button--delete"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="estudios-radiologicos__pagination">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`estudios-radiologicos__pagination-button ${page === currentPage ? 'active' : ''}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
            {mostrarModal && (
                <ModalConfirmacion
                    mensaje="¿Estás seguro de que deseas eliminar este estudio?"
                    onConfirm={confirmarEliminarEstudio}
                    onCancel={() => setMostrarModal(false)}
                />
            )}
        </div>
    );
    };
    

export default EstudiosRadiologicos;
