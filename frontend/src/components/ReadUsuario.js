import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReadUsuario.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const ReadUsuario = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usuariosPerPage = 5;

  const fetchUsuarios = async () => {
    const response = await fetch('http://localhost:5000/api/usuarios');
    const data = await response.json();
    setUsuarios(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleGoBack = (event) => {
    event.preventDefault();
    navigate(-1);
  };

  const handleExit = (event) => {
    event.preventDefault();
    navigate("/dashboard-root");
  };

  const indexOfLastUsuario = currentPage * usuariosPerPage;
  const indexOfFirstUsuario = indexOfLastUsuario - usuariosPerPage;
  const currentUsuarios = usuarios.slice(indexOfFirstUsuario, indexOfLastUsuario);

  const totalPages = Math.ceil(usuarios.length / usuariosPerPage);

  return (
    <div className="read-usuario-page">
      <header className="read-usuario-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <h1 className="welcome-message">Bienvenido al Módulo de gestión de Usuarios</h1>
        <h2 className="department-name">Usuarios Registrados en la base de datos</h2>
      </header>
      <div className="read-usuario-content">
        <div className="read-button-container">
          <button className="read-usuario-button" onClick={handleGoBack}>Ir Atrás</button>
          <button className="read-usuario-button" onClick={handleExit}>Ir a Inicio</button>
        </div>
        <div className="table-container">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <>
              <table className="usuario-table">
                <thead>
                  <tr className='read-usuario-table-descripcion-columna'>
                    <th>Nombre de Usuario</th>
                    <th>Nombre Real</th>
                    <th>Apellido Paterno</th>
                    <th>Apellido Materno</th>
                    <th>Rol</th>
                    <th>Matricula</th>
                  </tr>
                </thead>
                <tbody className='read-usuario-table-descripcion-filas'>
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
    </div>
  );
};

export default ReadUsuario;