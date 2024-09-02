import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './DeleteUsuario.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const DeleteUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState(null);
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (confirmDelete) {
      await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios/${id}`, {
        method: 'DELETE',
      });
      setUsuarios(usuarios.filter(usuario => usuario.id !== id));
      setMessage('El registro se ha borrado exitosamente');
    }
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

  return (
    <div className="delete-usuario-page">
      <header className="delete-usuario-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message">Bienvenido al Módulo de gestión de Usuarios</h1>
          <h2 className="department-name">Borrar Registros de Usuarios</h2>
        </div>
      </header>
      <div className="delete-usuario-content">
        <Sidebar />
        <div className="delete-search-container">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <select value={searchField} onChange={handleFieldChange}>
            <option value="nombre_usuario">Nombre Usuario</option>
            <option value="nombre_real">Nombre Real</option>
            <option value="apellido_paterno">Apellido Paterno</option>
            <option value="apellido_materno">Apellido Materno</option>
          </select>
        </div>
        <div className="usuario-table-container">
          <table className="usuario-table">
            <thead>
              <tr>
                <th>Nombre Usuario</th>
                <th>Nombre Real</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Matricula</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentUsuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre_usuario}</td>
                  <td>{usuario.nombre_real}</td>
                  <td>{usuario.apellido_paterno}</td>
                  <td>{usuario.apellido_materno}</td>
                  <td>{usuario.matricula}</td>
                  <td>
                    <button onClick={() => handleDelete(usuario.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-delete-usuario">
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
        {message && <p className="message-delete-success">{message}</p>}
      </div>
    </div>
  );
};

export default DeleteUsuario;