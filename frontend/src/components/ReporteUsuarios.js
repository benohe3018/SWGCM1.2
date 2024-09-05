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
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios`);
    const data = await response.json();
    console.log(data);
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
    if (searchField === 'nombre' && usuario.nombre) {
      return usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchField === 'apellido' && usuario.apellido) {
      return usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false; // Cambia esto para que no incluya usuarios no válidos
  });

  const indexOfLastUsuario = currentPage * usuariosPorPagina;
  const indexOfFirstUsuario = indexOfLastUsuario - usuariosPorPagina;
  const currentUsuarios = filteredUsuarios.slice(indexOfFirstUsuario, indexOfLastUsuario);

  const totalPages = Math.ceil(filteredUsuarios.length / usuariosPorPagina);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Usuarios', 20, 10);
    doc.autoTable({
      head: [['Nombre', 'Apellido', 'Email', 'Rol']],
      body: currentUsuarios.map(usuario => [
        usuario.nombre,
        usuario.apellido,
        usuario.email,
        usuario.rol
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
        <div className="search-container">
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
        <button onClick={generatePDF} className="pdf-button">Generar PDF</button>
        <div className="table-container">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <>
              <div className="usuario-table-container">
                <table className="usuario-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Email</th>
                      <th>Rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsuarios.map(usuario => (
                      <tr key={usuario.id}>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.apellido}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.rol}</td>
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