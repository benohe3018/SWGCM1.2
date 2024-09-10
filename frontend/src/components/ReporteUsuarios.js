import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './ReporteUsuarios.css'; // Asegúrate de crear este archivo CSS
import logoIMSS from '../images/LogoIMSS.jpg';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReporteUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usuariosPorPagina = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('nombre');

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios`);
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    } finally {
      setIsLoading(false);
    }
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

  const indexOfLastUsuario = currentPage * usuariosPorPagina;
  const indexOfFirstUsuario = indexOfLastUsuario - usuariosPorPagina;
  const currentUsuarios = filteredUsuarios.slice(indexOfFirstUsuario, indexOfLastUsuario);

  const totalPages = Math.ceil(filteredUsuarios.length / usuariosPorPagina);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de los Usuarios del sistema', 20, 10);
    doc.autoTable({
      head: [['Usuario', 'Nombre', 'Apellido Paterno', 'Apellido Materno', 'Rol', 'Matricula']],
      body: currentUsuarios.map(usuario => [
        usuario.nombre_usuario,
        usuario.nombre_real,
        usuario.apellido_paterno,
        usuario.apellido_materno,
        usuario.rol,
        usuario.matricula

      ]),
    });
    doc.save('reporte_usuarios.pdf');
  };

  return (
    <div className="reporte-usuario-page">
      <Sidebar />
      <header className="reporte-usuario-header">
        <img src={logoIMSS} alt="Logo IMSS" className="reporte-usuario__header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message-ReporteUsuario">Reporte de Usuarios</h1>
          <h2 className="department-name-ReporteUsuario">Generar informe de usuarios registrados</h2>
        </div>
      </header>
      
      <div className="reporte-usuario-content">
        <div className="reporte-usuario-busqueda">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <select value={searchField} onChange={handleFieldChange}>
            <option value="nombre">Nombre</option>
            <option value="apellido">Apellido</option>
          </select>
        </div>
        <button onClick={generatePDF} className="pdf-button">Imprimir Reporte en PDF</button>
        <div className="table-container">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <>
              <div className="usuario-table-container">
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
              </div>
              <div className="pagination-reporte-usuario">
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

export default ReporteUsuarios;