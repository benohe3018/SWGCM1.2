import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ReadUsuario.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const ReadUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usuariosPerPage = 5;

  const fetchUsuarios = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios`);
    const data = await response.json();
    setUsuarios(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const indexOfLastUsuario = currentPage * usuariosPerPage;
  const indexOfFirstUsuario = indexOfLastUsuario - usuariosPerPage;
  const currentUsuarios = usuarios.slice(indexOfFirstUsuario, indexOfLastUsuario);

  const totalPages = Math.ceil(usuarios.length / usuariosPerPage);

  return (
    <div className="read-usuario-page">
      <header className="read-usuario-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message">Bienvenido al Módulo de gestión de Usuarios</h1>
          <h2 className="department-name">Usuarios Registrados en la base de datos</h2>
        </div>
      </header>
      <nav className="navbar">
        <ul className="nav-links">
          <li><Link to="/">Cambiar Sesión</Link></li>
          <li><Link to="/create-medico">Capturar Nuevo Medico</Link></li>
          <li><Link to="/read-medico">Ver Médicos</Link></li>
          <li><Link to="/update-medico">Actualizar Registro de Médico</Link></li>
          <li><Link to="/delete-medico">Borrar Registro de Médico</Link></li>
          <li><Link to="/dashboard-root">Página de Inicio</Link></li>
        </ul>
        <div className="hamburger">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </nav>
      <div className="read-usuario-content">
        <div className="usuario-table-container">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <>
              <table className="usuario-table">
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
              <div className="pagination-read-usuario">
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
      <script src="script.js"></script>
    </div>
  );
};

export default ReadUsuario;