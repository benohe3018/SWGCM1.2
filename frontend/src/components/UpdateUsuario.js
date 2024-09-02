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

  const handleInputChange = (event, id) => {
    const { name, value } = event.target;

    const isValidName = (name) => /^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/.test(name) && name.length >= 1 && name.length <= 50;

    if (name === 'nombre_usuario') {
      if (!/^[a-zA-Z0-9]+$/.test(value) || value.length < 4 || value.length > 20) {
        alert('Por favor, introduce un nombre de usuario válido (4-20 caracteres alfanuméricos).');
        return;
      }
    } else if (['nombre_real', 'apellido_paterno', 'apellido_materno'].includes(name)) {
      if (!isValidName(value)) {
        alert('Por favor, introduce un nombre/apellido válido (solo letras, 1-50 caracteres).');
        return;
      }
    } else if (name === 'matricula') {
      if (!/^\d+$/.test(value) || value.length > 12) {
        alert('Por favor, introduce una matrícula válida (solo números, máximo 12 dígitos).');
        return;
      }
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

    const isValidName = (name) => /^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/.test(name) && name.length >= 1 && name.length <= 50;

    if (!usuarioToUpdate.nombre_usuario || !/^[a-zA-Z0-9]+$/.test(usuarioToUpdate.nombre_usuario)) {
      alert('Por favor, introduce un nombre de usuario válido (4-20 caracteres alfanuméricos).');
      return;
    }
    if (!isValidName(usuarioToUpdate.nombre_real)) {
      alert('Por favor, introduce un nombre real válido (solo letras, 2-50 caracteres).');
      return;
    }
    if (!isValidName(usuarioToUpdate.apellido_paterno)) {
      alert('Por favor, introduce un apellido paterno válido (solo letras, 2-50 caracteres).');
      return;
    }
    if (!isValidName(usuarioToUpdate.apellido_materno)) {
      alert('Por favor, introduce un apellido materno válido (solo letras, 2-50 caracteres).');
      return;
    }
    if (usuarioToUpdate.matricula && (!/^\d+$/.test(usuarioToUpdate.matricula) || usuarioToUpdate.matricula.length > 12)) {
      alert('Por favor, introduce una matrícula válida (solo números, máximo 12 dígitos).');
      return;
    }

    const responseCheck = await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios/matricula/${usuarioToUpdate.matricula}`);
    const dataCheck = await responseCheck.json();
    if (responseCheck.ok && Object.keys(dataCheck).length > 0 && dataCheck.id !== id) {
      alert('El usuario con esta matrícula ya existe en la base de datos. Intente con un nuevo registro');
      return;
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
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo-update-usuario" />
        <div className="header-texts-update-usuario">
          <h1 className="welcome-message-update-usuario">Bienvenido al Módulo de gestión de Usuarios</h1>
          <h2 className="department-name-update-usuario">Actualizar Registros de Usuarios</h2>
        </div>
      </header>
      <div className="main-layout">
        <Sidebar />
        <div className="update-usuario-content">
          {successMessage && <p className="success-message">{successMessage}</p>}
          <div className="update-search-container">
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
          <div className="update-usuario-table-container">
            <table className="usuario-table">
              <thead>
                <tr>
                  <th>Nombre de Usuario</th>
                  <th>Nombre Real</th>
                  <th>Apellido Paterno</th>
                  <th>Apellido Materno</th>
                  <th>Rol</th>
                  <th>Matrícula</th>
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody>
                {currentUsuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>
                      {editingId === usuario.id ? (
                        <input type="text" name="nombre_usuario" value={usuario.nombre_usuario} onChange={event => handleInputChange(event, usuario.id)} />
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
                        <input type="text" name="matricula" value={usuario.matricula} onChange={event => handleInputChange(event, usuario.id)} />
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