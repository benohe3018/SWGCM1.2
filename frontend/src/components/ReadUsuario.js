import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';// Asegúrate de que la ruta al logo es correcta
import './ReadUsuario.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const ReadUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('nombre_usuario');
  const usuariosPerPage = 10;

  const fetchUsuarios = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios`);
    const data = await response.json();
    setUsuarios(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

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
    <div className="read-usuario">
      <header className="read-usuario__header">
        <img src={logoIMSS} alt="Logo IMSS" className="read-usuario__header-logo" />
        <div className="read-usuario__header-texts">
          <h1 className="read-usuario__welcome-message">Bienvenido al Módulo de gestión de Usuarios</h1>
          <h2 className="read-usuario__department-name">Usuarios Registrados en la base de datos</h2>
        </div>
      </header>
      <div className="main-layout">
        <Sidebar />
        <div className="read-usuario__content">
          <div className="read-usuario__search-container">
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
          <div className="read-usuario__table-container">
            {isLoading ? (
              <p>Cargando...</p>
            ) : (
              <>
                <table className="read-usuario__table">
                  <thead>
                    <tr>
                      <th>Nombre de Usuario</th>
                      <th>Nombre Real</th>
                      <th>Apellido Paterno</th>
                      <th>Apellido Materno</th>
                      <th>Rol</th>
                      <th>Matrícula</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsuarios.map(usuario => (
                      <tr key={usuario.id}>
                        <td>{usuario.nombre_usuario}</td>
                        <td>{usuario.nombre_real}</td>
                        <td>{usuario.apellido_paterno}</td>
                        <td>{usuario.apellido_materno}</td>
                        <td>{usuario.rol}</td>
                        <td>{usuario.matricula}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="read-usuario__pagination">
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
    </div>
  );
};

export default ReadUsuario;
