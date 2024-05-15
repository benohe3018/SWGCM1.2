import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeleteUsuario.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const DeleteUsuario = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState(null);
  const usuariosPerPage = 5;

  useEffect(() => {
    const fetchUsuarios = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios`);
      const data = await response.json();
      setUsuarios(data);
    };
    fetchUsuarios();
  }, []);

  const handleDelete = async (id) => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios/${id}`, {
      method: 'DELETE',
    });
    setUsuarios(usuarios.filter(usuario => usuario.id !== id));
    setMessage('El registro se ha borrado exitosamente');
  };

  const handleGoBack = () => {
    navigate(-1); // Navega a la página anterior
  };

  const handleExit = () => {
    navigate('/dashboard-root'); // Navega a la página principal
  };

  const indexOfLastUsuario = currentPage * usuariosPerPage;
  const indexOfFirstUsuario = indexOfLastUsuario - usuariosPerPage;
  const currentUsuarios = usuarios.slice(indexOfFirstUsuario, indexOfLastUsuario);

  const totalPages = Math.ceil(usuarios.length / usuariosPerPage);

  return (
    <div className="delete-usuario-page">
      <header className="delete-usuario-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <h1 className="welcome-message">Bienvenido al Módulo de gestion de Usuarios</h1>
        <h2 className="department-name">Borrar Registros de Usuarios</h2>
      </header>
      <div className="delete-usuario-content">
        <div className="button-delete-container">
          <button className="button-delete-usuario" onClick={handleGoBack}>Ir Atrás</button>
          <button className="button-delete-usuario" onClick={handleExit}>Ir a Inicio</button>
        </div>
        <div className="usuario-table-container">
          <table className="usuario-table">
            <thead>
              <tr>
                <th>ID</th>
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
                  <td>{usuario.id}</td>
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
        {message && <p className="message-delete-success">{message}</p>}
      </div>
    </div>
  );
};

export default DeleteUsuario;