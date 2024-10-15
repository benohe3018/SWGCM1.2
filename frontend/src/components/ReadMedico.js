import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './ReadMedico.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const ReadMedico = () => {
  const [medicos, setMedicos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const medicosPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('nombre');

  const fetchMedicos = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/medicos`);
    const data = await response.json();
    setMedicos(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMedicos();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFieldChange = (event) => {
    setSearchField(event.target.value);
  };

  const filteredMedicos = medicos.filter((medico) => {
    if (searchField === 'nombre') {
      return medico.nombre_medico.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchField === 'apellidoPaterno') {
      return medico.apellido_paterno_medico.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchField === 'apellidoMaterno') {
      return medico.apellido_materno_medico.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchField === 'matricula') {
      return medico.matricula.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return medico;
  });

  const indexOfLastMedico = currentPage * medicosPerPage;
  const indexOfFirstMedico = indexOfLastMedico - medicosPerPage;
  const currentMedicos = filteredMedicos.slice(indexOfFirstMedico, indexOfLastMedico);

  const totalPages = Math.ceil(filteredMedicos.length / medicosPerPage);

  return (
    <div className="read-medico">
      <header className="read-medico__header">
        <img src={logoIMSS} alt="Logo IMSS" className="read-medico__header-logo" />
        <div className="read-medico__header-texts">
          <h1 className="read-medico__welcome-message">Sistema de Gestión de Médicos</h1>
          <h2 className="read-medico__department-name">Médicos Registrados en la base de datos</h2>
        </div>
      </header>

      <div className="main-layout">
        <Sidebar />
        <div className="read-medico__content">
          <div className="read-medico__search-container">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <select value={searchField} onChange={handleFieldChange}>
              <option value="nombre">Nombre</option>
              <option value="apellidoPaterno">Apellido Paterno</option>
              <option value="apellidoMaterno">Apellido Materno</option>
            </select>
          </div>
          <div className="read-medico__table-container">
            {isLoading ? (
              <p>Cargando...</p>
            ) : (
              <>
                <table className="read-medico__table">
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
                    {currentMedicos.map((medico) => (
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
                <div className="read-medico__pagination">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
    </div>
  );
};

export default ReadMedico;