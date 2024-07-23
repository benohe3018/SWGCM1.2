import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './UpdateUsuario.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const UpdateUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('nombre_usuario');
  const usuariosPerPage = 10;

  useEffect(() => {
    const fetchUsuarios = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios`);
      const data = await response.json();
      setUsuarios(data);
    };
    fetchUsuarios();
  }, []);

  const [errorMessages, setErrorMessages] = useState({});

  const handleInputChange = (event, id) => {
    const { name, value } = event.target;
    let errorMessage = "";

    if (name === "nombre_usuario") {
      if (/^\d+$/.test(value)) {
        errorMessage = "Error: No se permiten solo números";
      } else if (/^\d.*$/.test(value)) {
        errorMessage = "Error: No se permite que comience con números";
      } else if (/^\s+$/.test(value) || value.trim() === "") {
        errorMessage = "Error: No se permiten espacios en blanco";
      } else if (value.includes("…")) {
        errorMessage = "Error: No se permiten puntos suspensivos";
      } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ][a-zA-ZÁÉÍÓÚáéíóúñÑ0-9]*$/.test(value)) {
        errorMessage = "Error: Nombre de usuario no válido";
      }
    } else if (name === "nombre_real" || name === "apellido_paterno" || name === "apellido_materno") {
      if (/^\d+$/.test(value)) {
        errorMessage = "Error: No se permiten solo números";
      } else if (/^\d.*$/.test(value)) {
        errorMessage = "Error: No se permite que comience con números";
      } else if (/^\s+$/.test(value) || value.trim() === "") {
        errorMessage = "Error: No se permiten espacios en blanco";
      } else if (value.includes("…")) {
        errorMessage = "Error: No se permiten puntos suspensivos";
      } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/.test(value)) {
        errorMessage = "Error: Nombre no válido";
      }
    } else if (name === "matricula") {
      if (!/^\d{1,12}$/.test(value)) {
        errorMessage = "Error: Matrícula no válida (debe ser un número de hasta 12 dígitos)";
      }
    }

    if (errorMessage) {
      setErrorMessages({ ...errorMessages, [id]: errorMessage });
      return;
    } else {
      setErrorMessages({ ...errorMessages, [id]: "" });
    }

    setUsuarios(usuarios.map(usuario => {
      if (usuario.id === id) {
        return { ...usuario, [name]: value };
      } else {
        return usuario;
      }
    }));
  };

  const handleSave = async (id) => {
    const usuarioToUpdate = usuarios.find(usuario => usuario.id === id);

    // Verifica si la matrícula ya existe
    if (usuarioToUpdate.matricula) {
      const responseCheck = await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios/matricula/${usuarioToUpdate.matricula}`);
      const dataCheck = await responseCheck.json();
      if (responseCheck.ok && dataCheck.id !== id) {
        setErrorMessages({ ...errorMessages, [id]: "Error: La matrícula ya existe en la base de datos." });
        return;
      }
    }

    await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuarioToUpdate)
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

  const filteredUsuarios = usuarios.filter((usuario) => {
    if (searchField === 'nombre_usuario') {
      return usuario.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchField === 'nombre_real') {
      return usuario.nombre_real.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchField === 'apellido_paterno') {
      return usuario.apellido_paterno.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchField === 'apellido_materno') {
      return usuario.apellido_materno.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchField === 'matricula') {
      return usuario.matricula.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return usuario;
  });

  const indexOfLastUsuario = currentPage * usuariosPerPage;
  const indexOfFirstUsuario = indexOfLastUsuario - usuariosPerPage;
  const currentUsuarios = filteredUsuarios.slice(indexOfFirstUsuario, indexOfLastUsuario);

  const totalPages = Math.ceil(filteredUsuarios.length / usuariosPerPage);

  const roles = [
    'Usuario_de_Campo',
    'Usuario_administrador',
    'Administrador'
  ];

  return (
    <div className="update-usuario-page">
      <header className="update-usuario-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message">Bienvenido al Módulo de gestión de Usuarios</h1>
          <h2 className="department-name">Actualizar Registros de Usuarios</h2>
        </div>
      </header>
      <div className="main-layout">
        <Sidebar />
        <div className="update-usuario-content">
          {successMessage && <p className="success-message">{successMessage}</p>}
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <select value={searchField} onChange={handleFieldChange}>
              <option value="nombre_usuario">Nombre de Usuario</option>
              <option value="nombre_real">Nombre Real</option>
              <option value="apellido_paterno">Apellido Paterno</option>
              <option value="apellido_materno">Apellido Materno</option>
            </select>
          </div>
          <div className="usuario-table-container">
            <table className="usuario-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre de Usuario</th>
                  <th>Nombre Real</th>
                  <th>Apellido Paterno</th>
                  <th>Apellido Materno</th>
                  <th>Rol</th>
                  <th>Matricula</th>
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody>
                {currentUsuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>
                      {editingId === usuario.id ? (
                        <div>
                          <input type="text" name="nombre_usuario" value={usuario.nombre_usuario} onChange={event => handleInputChange(event, usuario.id)} />
                          {errorMessages[usuario.id] && <p className="error-message">{errorMessages[usuario.id]}</p>}
                        </div>
                      ) : (
                        usuario.nombre_usuario
                      )}
                    </td>
                    <td>
                      {editingId === usuario.id ? (
                        <input type="text" name="nombre_real" value={usuario.nombre_real} onChange={event => handleInputChange(event, usuario.id)} />
                      ) : (
                        usuario.nombre_real
                      )}
                    </td>
                    <td>
                      {editingId === usuario.id ? (
                        <input type="text" name="apellido_paterno" value={usuario.apellido_paterno} onChange={event => handleInputChange(event, usuario.id)} />
                      ) : (
                        usuario.apellido_paterno
                      )}
                    </td>
                    <td>
                      {editingId === usuario.id ? (
                        <input type="text" name="apellido_materno" value={usuario.apellido_materno} onChange={event => handleInputChange(event, usuario.id)} />
                      ) : (
                        usuario.apellido_materno
                      )}
                    </td>
                    <td>
                      {editingId === usuario.id ? (
                        <select name="rol" value={usuario.rol} onChange={event => handleInputChange(event, usuario.id)}>
                          <option value="">Seleccione un rol</option>
                          {roles.map(rol => (
                            <option key={rol} value={rol}>{rol}</option>
                          ))}
                        </select>
                      ) : (
                        usuario.rol
                      )}
                    </td>
                    <td>
                      {editingId === usuario.id ? (
                        <div>
                          <input type="text" name="matricula" value={usuario.matricula} onChange={event => handleInputChange(event, usuario.id)} />
                          {errorMessages[usuario.id] && <p className="error-message">{errorMessages[usuario.id]}</p>}
                        </div>
                      ) : (
                        usuario.matricula
                      )}
                    </td>
                    <td>
                      {editingId === usuario.id ? (
                        <button onClick={() => handleSave(usuario.id)}>Guardar</button>
                      ) : (
                        <button onClick={() => setEditingId(usuario.id)}>Editar</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination-update-usuario">
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

export default UpdateUsuario;
