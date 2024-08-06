import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DiagnosticosPresuntivos.css'; 
import { getDiagnosticos, createDiagnostico, updateDiagnostico, deleteDiagnostico } from './diagnosticosService';
import FormularioDiagnosticoPresuntivo from './FormularioDiagnostico';
import ModalConfirmacion from './ModalConfirmacion';
import logoIMSS from '../images/LogoIMSS.jpg';

const DiagnosticosPresuntivos = ({ vistaInicial }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [diagnosticoSeleccionado, setDiagnosticoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [vista, setVista] = useState(vistaInicial || 'ver'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('nombre_diagnostico');
  const diagnosticosPerPage = 10;

  useEffect(() => {
    if (location.pathname === '/crear-diagnostico') {
      setVista('crear');
    } else if (location.pathname === '/ver-diagnosticos') {
      setVista('ver');
    } else if (location.pathname === '/update-diagnostico') {
      setVista('editar');
    } else if (location.pathname === '/delete-diagnostico') {
      setVista('eliminar');
    }
  }, [location.pathname]);

  const inicializarDiagnosticos = useCallback(async () => {
    try {
      setCargando(true);
      const data = await getDiagnosticos();
      data.sort((a, b) => a.id - b.id);
      setDiagnosticos(data);
      setError(null);
    } catch (error) {
      console.error("Error al inicializar diagnósticos:", error);
      setError("Hubo un problema al cargar los diagnósticos presuntivos. Por favor, intente de nuevo.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    inicializarDiagnosticos();
  }, [inicializarDiagnosticos]);

  const cargarDiagnosticos = async () => {
    try {
      setCargando(true);
      const data = await getDiagnosticos();
      data.sort((a, b) => a.id - b.id);
      setDiagnosticos(data);
      setError(null);
    } catch (error) {
      console.error("Error al cargar diagnósticos:", error);
      setError("Hubo un problema al cargar los diagnósticos presuntivos. Por favor, intente de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const handleCrearDiagnostico = async (nuevoDiagnostico) => {
    try {
      await createDiagnostico(nuevoDiagnostico);
      setMensaje('Diagnóstico creado exitosamente.');
      setTimeout(() => {
        setMensaje(null);
      },3000); 
    } catch (error) {
      console.error("Error al crear diagnóstico:", error);
      setError("No se pudo crear el diagnóstico. Por favor, intente de nuevo.");
    }
  };

  const handleEditarDiagnostico = async (diagnosticoEditado) => {
    try {
      if (!diagnosticoEditado.id) {
        throw new Error("El ID del diagnóstico no está definido");
      }
      if (!validarNombre(diagnosticoEditado.nombre_diagnostico)) {
        alert('El nombre del diagnóstico no es válido.');
        return;
      }
      await updateDiagnostico(diagnosticoEditado.id, diagnosticoEditado);
      await cargarDiagnosticos();
      setDiagnosticoSeleccionado(null);
      setMensaje('Diagnóstico actualizado exitosamente.');
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      console.error("Error al editar diagnóstico:", error);
      setError("No se pudo editar el diagnóstico. Por favor, intente de nuevo.");
    }
  };

  const handleEliminarDiagnostico = (id) => {
    const diagnostico = diagnosticos.find(e => e.id === id);
    if (diagnostico) {
      setDiagnosticoSeleccionado(diagnostico);
      setMostrarModal(true);
    }
  };

  const confirmarEliminarDiagnostico = async () => {
    try {
      await deleteDiagnostico(diagnosticoSeleccionado.id);
      await cargarDiagnosticos();
      setMostrarModal(false);
      setDiagnosticoSeleccionado(null);
      setMensaje('Diagnóstico eliminado exitosamente.');
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      console.error("Error al eliminar diagnóstico:", error);
      setError("No se pudo eliminar el diagnóstico. Por favor, intente de nuevo.");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFieldChange = (event) => {
    setSearchField(event.target.value);
  };

  const validarNombre = (nombre) => {
    const regex = /^[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ\s,.'-]+$/;
    if (!regex.test(nombre)) {
      return false;
    }
    const invalidPatterns = [/^[\s,.]+$/, /^[\s,.]/, /[\s,.]$/];
    for (const pattern of invalidPatterns) {
      if (pattern.test(nombre)) {
        return false;
      }
    }
    return true;
  };

  const filteredDiagnosticos = diagnosticos.filter((diagnostico) => {
    if (searchField === 'nombre_diagnostico') {
      return diagnostico.nombre_diagnostico.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return diagnostico;
  });

  const indexOfLastDiagnostico = currentPage * diagnosticosPerPage;
  const indexOfFirstDiagnostico = indexOfLastDiagnostico - diagnosticosPerPage;
  const currentDiagnosticos = filteredDiagnosticos.slice(indexOfFirstDiagnostico, indexOfLastDiagnostico);

  const totalPages = Math.ceil(filteredDiagnosticos.length / diagnosticosPerPage);

  if (cargando) {
    return <div>Cargando diagnósticos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="diagnosticos-presuntivos-page">
      <header className="diagnosticos-presuntivos-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message">Sistema de Gestión de Diagnósticos Presuntivos</h1>
          <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
        </div>
      </header>
      <div className="diagnosticos-presuntivos-content">
        {mensaje && <div className="mensaje-confirmacion">{mensaje}</div>}
        {vista === 'crear' && (
          <FormularioDiagnosticoPresuntivo
            modo="crear"
            onSubmit={handleCrearDiagnostico}
            onCancel={() => navigate('/ver-diagnosticos')}
          />
        )}
        {vista === 'ver' && (
          <>
            <div className="busqueda-diagnostico">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <select value={searchField} onChange={handleFieldChange}>
                <option value="nombre_diagnostico">Nombre del Diagnóstico</option>
              </select>
            </div>
            <div className="tabla-diagnosticos-container">
              <table className="tabla-diagnosticos">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre del Diagnóstico</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDiagnosticos.map((diagnostico) => (
                    <tr key={diagnostico.id}>
                      <td>{diagnostico.id}</td>
                      <td>{diagnostico.nombre_diagnostico}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination-read-diagnostico">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage ? 'active' : ''}
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
            <div className="busqueda-diagnostico">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select value={searchField} onChange={handleFieldChange}>
                <option value="nombre_diagnostico">Nombre del Diagnóstico</option>
              </select>
            </div>
            <div className="tabla-diagnosticos-container">
              <table className="tabla-diagnosticos">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre del Diagnóstico</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDiagnosticos.map((diagnostico) => (
                    <tr key={diagnostico.id}>
                      <td>{diagnostico.id}</td>
                      <td>
                        <input
                          type="text"
                          value={diagnostico.nombre_diagnostico}
                          onChange={(e) => {
                            const newDiagnosticos = [...diagnosticos];
                            const index = newDiagnosticos.findIndex(diag => diag.id === diagnostico.id);
                            newDiagnosticos[index].nombre_diagnostico = e.target.value;
                            setDiagnosticos(newDiagnosticos);
                          }}
                        />
                      </td>
                      <td>
                        <div className="botones-acciones">
                          <button
                            onClick={() => handleEditarDiagnostico(diagnostico)}
                            className="editar-button"
                          >
                            Guardar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination-read-diagnostico">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage ? 'active' : ''}
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
            <div className="busqueda-diagnostico">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <select value={searchField} onChange={handleFieldChange}>
                <option value="nombre_diagnostico">Nombre del Diagnóstico</option>
              </select>
            </div>
            <div className="tabla-diagnosticos-container">
              <table className="tabla-diagnosticos">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre del Diagnóstico</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDiagnosticos.map((diagnostico) => (
                    <tr key={diagnostico.id}>
                      <td>{diagnostico.id}</td>
                      <td>{diagnostico.nombre_diagnostico}</td>
                      <td>
                        <div className="botones-acciones">
                          <button
                            onClick={() => handleEliminarDiagnostico(diagnostico.id)}
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
              <div className="pagination-read-diagnostico">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage ? 'active' : ''}
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
          mensaje="¿Estás seguro de que deseas eliminar este diagnóstico?"
          onConfirm={confirmarEliminarDiagnostico}
          onCancel={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
};

export default DiagnosticosPresuntivos;
