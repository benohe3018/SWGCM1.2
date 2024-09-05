import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './UpdateMedico.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const UpdateMedico = () => {
  const [medicos, setMedicos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('nombre_medico');
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

    const isValidName = (name) => /^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/.test(name) && name.length >= 1 && name.length <= 50;

    if (name === 'nombre_medico' && !isValidName(value)) {
      alert('Por favor, introduce un nombre válido.');
      return;
    }

    if (name === 'especialidad' && value === '') { // Asumiendo que '' representa ninguna selección
      alert('Por favor, selecciona una especialidad.');
      return;
    }
  
    // Actualiza el estado con el nuevo valor si pasa la validación
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

    const isValidName = (name) => /^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/.test(name) && name.length >= 1 && name.length <= 50;

    if (!isValidName(medicoToUpdate.nombre_medico)) {
      alert('Por favor, introduce un nombre válido (solo letras, 2-50 caracteres).');
      return;
    }
    if (!isValidName(medicoToUpdate.apellido_paterno_medico)) {
      alert('Por favor, introduce un apellido paterno válido (solo letras, 2-50 caracteres).');
      return;
    }
    if (!isValidName(medicoToUpdate.apellido_materno_medico)) {
      alert('Por favor, introduce un apellido materno válido (solo letras, 2-50 caracteres).');
      return;
    }
    if (medicoToUpdate.matricula && (!/^\d+$/.test(medicoToUpdate.matricula) || medicoToUpdate.matricula.length > 12)) {
      alert('Por favor, introduce una matrícula válida (solo números, máximo 12 dígitos).');
      return;
    }

    const responseCheck = await fetch(`${process.env.REACT_APP_API_URL}/api/medicos/matricula/${medicoToUpdate.matricula}`);
    const dataCheck = await responseCheck.json();
    if (responseCheck.ok && Object.keys(dataCheck).length > 0 && dataCheck.id_medico !== id_medico) {
      alert('El médico con esta matrícula ya existe en la base de datos. Intente con un nuevo registro');
      return;
    }

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
    if (searchField === 'nombre_medico') {
      return medico.nombre_medico.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchField === 'apellido_paterno_medico') {
      return medico.apellido_paterno_medico.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchField === 'apellido_materno_medico') {
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
        <img src={logoIMSS} alt="Logo IMSS" className="update-header-logo" />
        <div className="update-header-text">
          <h1 className="update-welcome-message">Bienvenido al Módulo de gestión de Médicos</h1>
          <h2 className="update-department-name">Actualizar Registros de Médicos</h2>
        </div>
      </header>
      <div className="main-layout">
        <Sidebar />
        <div className="update-medico-content">
          {successMessage && <p className="success-message">{successMessage}</p>}
          <div className="update-medico-search-container">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <select value={searchField} onChange={handleFieldChange}>
              <option value="nombre_medico">Nombre</option>
              <option value="apellido_paterno_medico">Apellido Paterno</option>
              <option value="apellido_materno_medico">Apellido Materno</option>
            </select>
          </div>
          <div className="update-medico-table-container">
            <table className="update-medico-table">
              <thead>
                <tr>
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
      </div>
    </div>
  );
};

export default UpdateMedico;

