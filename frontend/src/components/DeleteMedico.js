import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DeleteMedico.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const DeleteMedico = () => {
  const [medicos, setMedicos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState(null);
  const medicosPerPage = 5;

  useEffect(() => {
    const fetchMedicos = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/medicos`);
      const data = await response.json();
      setMedicos(data);
    };
    fetchMedicos();
  }, []);

  const handleDelete = async (id_medico) => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/medicos/${id_medico}`, {
      method: 'DELETE',
    });
    setMedicos(medicos.filter(medico => medico.id_medico !== id_medico));
    setMessage('El registro se ha borrado exitosamente');
  };

  const indexOfLastMedico = currentPage * medicosPerPage;
  const indexOfFirstMedico = indexOfLastMedico - medicosPerPage;
  const currentMedicos = medicos.slice(indexOfFirstMedico, indexOfLastMedico);

  const totalPages = Math.ceil(medicos.length / medicosPerPage);

  return (
    <div className="delete-medico-page">
      <header className="delete-medico-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message">Bienvenido al Módulo de gestión de Médicos</h1>
          <h2 className="department-name">Borrar Registros de Médicos</h2>
        </div>
      </header>
      <nav className="navbar">
        <ul className="nav-links">
          <li><Link to="/">Cambiar Sesión</Link></li>
          <li><Link to="/create-medico">Capturar Nuevo Medico</Link></li>
          <li><Link to="/read-medico">Ver Médicos</Link></li>
          <li><Link to="/update-medico">Actualizar Registro de Médico</Link></li>
          <li><Link to="/delete-medico">Borrar Registro de Médico</Link></li>
          <li><Link to="/dashboard-root">Página de Inicio</Link></li>
        </ul>
        <div className="hamburger">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </nav>
      <div className="delete-medico-content">
        <div className="medico-table-container">
          <table className="medico-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Especialidad</th>
                <th>Matrícula</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentMedicos.map(medico => (
                <tr key={medico.id_medico}>
                  <td>{medico.id_medico}</td>
                  <td>{medico.nombre_medico}</td>
                  <td>{medico.apellido_paterno_medico}</td>
                  <td>{medico.apellido_materno_medico}</td>
                  <td>{medico.especialidad}</td>
                  <td>{medico.matricula}</td>
                  <td>
                    <button onClick={() => handleDelete(medico.id_medico)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-delete-medico">
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
        {message && <p className='message-delete-success'>{message}</p>}
      </div>
      <script src="script.js"></script>
    </div>
  );
};

export default DeleteMedico;