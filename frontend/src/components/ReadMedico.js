import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ReadMedico.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const ReadMedico = () => {
  const [medicos, setMedicos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('nombre_medico');
  const medicosPerPage = 5;

  const fetchMedicos = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/medicos`);
    const data = await response.json();
    setMedicos(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMedicos();
  }, []);

  const handleSearch = (medicos) => {
    return medicos.filter(medico => {
      const value = medico[searchType].toLowerCase();
      return value.includes(searchTerm.toLowerCase());
    });
  };

  const indexOfLastMedico = currentPage * medicosPerPage;
  const indexOfFirstMedico = indexOfLastMedico - medicosPerPage;
  const filteredMedicos = handleSearch(medicos);
  const currentMedicos = filteredMedicos.slice(indexOfFirstMedico, indexOfLastMedico);

  const totalPages = Math.ceil(filteredMedicos.length / medicosPerPage);

  return (
    <div className="read-medico-page">
      <header className="read-medico-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message">Bienvenido al Módulo de gestión de Médicos</h1>
          <h2 className="department-name">Médicos Registrados en la base de datos</h2>
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
      <div className="read-medico-content">
        <div className="search-container">
          <input 
            type="text" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            placeholder="Buscar..."
          />
          <select value={searchType} onChange={e => setSearchType(e.target.value)}>
            <option value="nombre_medico">Nombre</option>
            <option value="apellido_paterno_medico">Apellido Paterno</option>
            <option value="apellido_materno_medico">Apellido Materno</option>
            <option value="matricula">Matrícula</option>
          </select>
        </div>
        <div className="table-container">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <>
              <div className="medico-table-container">
                <table className="medico-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Apellido Paterno</th>
                      <th>Apellido Materno</th>
                      <th>Especialidad</th>
                      <th>Matrícula</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMedicos.map(medico => (
                      <tr key={medico.id_medico}>
                        <td>{medico.nombre_medico}</td>
                        <td>{medico.apellido_paterno_medico}</td>
                        <td>{medico.apellido_materno_medico}</td>
                        <td>{medico.especialidad}</td>
                        <td>{medico.matricula}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination-read-medico">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadMedico;
