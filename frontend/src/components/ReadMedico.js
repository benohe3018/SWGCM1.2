import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReadMedico.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const ReadMedico = () => {
  const navigate = useNavigate();
  const [medicos, setMedicos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const medicosPerPage = 5;

  const fetchMedicos = async () => {
    const response = await fetch('http://localhost:5000/api/medicos');
    const data = await response.json();
    setMedicos(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMedicos();
  }, []);

  const handleGoBack = (event) => {
    event.preventDefault();
    navigate(-1);
  };

  const handleExit = (event) => {
    event.preventDefault();
    navigate("/dashboard-root");
  };

  const indexOfLastMedico = currentPage * medicosPerPage;
  const indexOfFirstMedico = indexOfLastMedico - medicosPerPage;
  const currentMedicos = medicos.slice(indexOfFirstMedico, indexOfLastMedico);

  const totalPages = Math.ceil(medicos.length / medicosPerPage);

  return (
    <div className="read-medico-page">
      <header className="read-medico-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <h1 className="welcome-message">Bienvenido al Módulo de gestion de Medicos</h1>
        <h2 className="department-name">Medicos Registrados en la base de datos</h2>
      </header>
      <div className="read-medico-content">
        <div className="read-button-container">
          <button className="read-medico-button" onClick={handleGoBack}>Ir Atrás</button>
          <button className="read-medico-button" onClick={handleExit}>Ir a Inicio</button>
        </div>
        <div className="table-container">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <>
              <table className="medico-table">
                <thead>
                  <tr className='read-medico-table-descripcion-columna'>
                    <th>Nombre</th>
                    <th>Apellido Paterno</th>
                    <th>Apellido Materno</th>
                    <th>Especialidad</th>
                    <th>Matricula</th>
                  </tr>
                </thead>
                <tbody className='read-medico-table-descripcion-filas'>
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