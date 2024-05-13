import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateMedico.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const UpdateMedico = () => {
  const navigate = useNavigate();
  const [medicos, setMedicos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const medicosPerPage = 5;

  useEffect(() => {
    const fetchMedicos = async () => {
      const response = await fetch('http://localhost:5000/api/medicos');
      const data = await response.json();
      setMedicos(data);
    };
    fetchMedicos();
  }, []);

  const handleInputChange = (event, id_medico) => {
    setMedicos(medicos.map(medico => {
      if (medico.id_medico === id_medico) {
        return {...medico, [event.target.name]: event.target.value};
      } else {
        return medico;
      }
    }));
  };

  const handleSave = async (id_medico) => {
    const medicoToUpdate = medicos.find(medico => medico.id_medico === id_medico);
    await fetch(`http://localhost:5000/api/medicos/${id_medico}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(medicoToUpdate)
    });
    setEditingId(null);
  };

  const handleGoBack = () => {
    navigate(-1); // Navega a la página anterior
  };

  const handleExit = () => {
    navigate('/dashboard-root'); // Navega a la página principal
  };

  const indexOfLastMedico = currentPage * medicosPerPage;
  const indexOfFirstMedico = indexOfLastMedico - medicosPerPage;
  const currentMedicos = medicos.slice(indexOfFirstMedico, indexOfLastMedico);

  const totalPages = Math.ceil(medicos.length / medicosPerPage);

  return (
    <div className="update-medico-page">
      <header className="update-medico-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <h1 className="welcome-message">Bienvenido al Módulo de gestion de Medicos</h1>
        <h2 className="department-name">Actualizar Registros de Médicos</h2>
      </header>
      <div className="update-medico-content">
        <div className="button-update-container">
          <button className="button-update-medico" onClick={handleGoBack}>Ir Atrás</button>
          <button className="button-update-medico" onClick={handleExit}>Ir a Inicio</button>
        </div>
        <table className='medico-table'>
          <thead>
            <tr className='read-medico-table-descripcion-columna'>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>Especialidad</th>
              <th>Matricula</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody className='read-medico-table-descripcion-filas'>
                {currentMedicos.map(medico => (
              <tr key={medico.id_medico}>
                <td>{medico.id_medico}</td>
                <td>
                  {editingId === medico.id_medico ? (
                    <input type="text" name="nombre_medico" value={medico.nombre_medico} onChange={event => handleInputChange(event, medico.id_medico)} />
                  ) : (
                    medico.nombre_medico
                  )}
                </td>
                <td>
                  {editingId === medico.id_medico ? (
                    <input type="text" name="apellido_paterno_medico" value={medico.apellido_paterno_medico} onChange={event => handleInputChange(event, medico.id_medico)} />
                  ) : (
                    medico.apellido_paterno_medico
                  )}
                </td>
                <td>
                  {editingId === medico.id_medico ? (
                    <input type="text" name="apellido_materno_medico" value={medico.apellido_materno_medico} onChange={event => handleInputChange(event, medico.id_medico)} />
                  ) : (
                    medico.apellido_materno_medico
                  )}
                </td>
                <td>
                  {editingId === medico.id_medico ? (
                    <input type="text" name="especialidad" value={medico.especialidad} onChange={event => handleInputChange(event, medico.id_medico)} />
                  ) : (
                    medico.especialidad
                  )}
                </td>
                <td>
                  {editingId === medico.id_medico ? (
                    <input type="text" name="matricula" value={medico.matricula} onChange={event => handleInputChange(event, medico.id_medico)} />
                  ) : (
                    medico.matricula
                  )}
                </td>
                <td>
                  {editingId === medico.id_medico ? (
                    <button onClick={() => handleSave(medico.id_medico)}>Guardar</button>
                  ) : (
                    <button onClick={() => setEditingId(medico.id_medico)}>Editar</button>
                  )}
                </td>
              </tr>
            ))}
      </tbody>
        </table>
      </div> 
      <div className="pagination-update-medico">
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
  );
};

export default UpdateMedico;