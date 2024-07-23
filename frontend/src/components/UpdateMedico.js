import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UpdateMedico.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const UpdateMedico = () => {
  const [medicos, setMedicos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
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

  const handleInputChange = (event, id_medico) => {
    const { name, value } = event.target;

    // Validaciones para evitar caracteres inválidos
    if (name === 'nombre_medico' || name === 'apellido_paterno_medico' || name === 'apellido_materno_medico') {
      if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]*$/.test(value)) {
        return;
      }
    } else if (name === 'matricula') {
      if (!/^\d*$/.test(value)) {
        return;
      }
    }

    setMedicos(medicos.map(medico => {
      if (medico.id_medico === id_medico) {
        return { ...medico, [name]: value };
      } else {
        return medico;
      }
    }));
  };

  const handleSave = async (id_medico) => {
    const medicoToUpdate = medicos.find(medico => medico.id_medico === id_medico);
    await fetch(`${process.env.REACT_APP_API_URL}/api/medicos/${id_medico}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(medicoToUpdate)
    });
    setEditingId(null);
    setSuccessMessage('El registro se ha actualizado correctamente');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
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

  const especialidades = [
    'Traumatología',
    'Cardiología',
    'Cirugia',
    'Endocrinología',
    'Neurocirugia',
    'Medicina interna',
    'Nefrología',
    'Neurología',
    'Oncología',
    'Pediatría',
    'Urología',
    'Salud en el trabajo',
    'Medicina de Urgencias',
    'Radiología'
  ];

  return (
    <div className="update-medico-page">
      <header className="update-medico-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message">Bienvenido al Módulo de gestión de Médicos</h1>
          <h2 className="department-name">Actualizar Registros de Médicos</h2>
        </div>
      </header>
      
      <div className="update-medico-content">
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="search-container">
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
        <div className="medico-table-container">
          <table className="medico-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Especialidad</th>
                <th>Matricula</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
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
                      <select name="especialidad" value={medico.especialidad} onChange={event => handleInputChange(event, medico.id_medico)}>
                        <option value="">Seleccione una especialidad</option>
                        {especialidades.map(especialidad => (
                          <option key={especialidad} value={especialidad}>{especialidad}</option>
                        ))}
                      </select>
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
      <script src="script.js"></script>
    </div>
  );
};

export default UpdateMedico;

