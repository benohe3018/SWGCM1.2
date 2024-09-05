import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './DeleteMedico.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const DeleteMedico = () => {
  const [medicos, setMedicos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('nombre');
  const medicosPerPage = 10;

  useEffect(() => {
    const fetchMedicos = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/medicos`);
      const data = await response.json();
      setMedicos(data);
    };
    fetchMedicos();
  }, []);

  const handleDelete = async (id_medico) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este médico?');
    if (confirmDelete) {
      await fetch(`${process.env.REACT_APP_API_URL}/api/medicos/${id_medico}`, {
        method: 'DELETE',
      });
      setMedicos(medicos.filter(medico => medico.id_medico !== id_medico));
      setMessage('El registro del médico se ha borrado exitosamente');
    }
  };

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
    <div className="delete-medico-page">
      <header className="delete-medico-header">
        <img src={logoIMSS} alt="Logo IMSS" className="delete-header-logo" />
        <div className="delete-header-texts">
          <h1 className="delete-welcome-message">Bienvenido al Módulo de gestión de Médicos</h1>
          <h2 className="delete-department-name">Borrar Registros de Médicos</h2>
        </div>
      </header>
      
      <div className="delete-medico-content">
        <Sidebar />
        <div className="delete-medico-search-container">
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
            <option value="matricula">Matrícula</option>
          </select>
        </div>
        <div className="delete-medico-table-container">
          <table className="delete-medico-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Especialidad</th>
                <th>Matrícula</th>
                <th>Borrar</th>
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
                  <td>
                    <button onClick={() => handleDelete(medico.id_medico)}>Borrar</button>
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
    </div>
  );
};

export default DeleteMedico;

