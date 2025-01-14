import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './ReporteMedicos.css';
import logoIMSS from '../images/LogoIMSS.jpg';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReporteMedicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const medicosPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('nombre');

  const fetchMedicos = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/medicos`);
    const data = await response.json();
    setMedicos(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMedicos();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFieldChange = (event) => {
    setSearchField(event.target.value);
  };

  const filteredMedicos = medicos.filter((medico) => {
    if (searchField === 'nombre') {
      return medico.nombre_medico.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchField === 'apellidoPaterno') {
      return medico.apellido_paterno_medico.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchField === 'apellidoMaterno') {
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

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Médicos', 20, 10);
    doc.autoTable({
      head: [['Nombre', 'Apellido Paterno', 'Apellido Materno', 'Especialidad', 'Matrícula']],
      body: currentMedicos.map(medico => [
        medico.nombre_medico,
        medico.apellido_paterno_medico,
        medico.apellido_materno_medico,
        medico.especialidad,
        medico.matricula
      ]),
    });
    doc.save('reporte_medicos.pdf');
  };

  return (
    <div className="reporte-medico">
      <Sidebar />
      <header className="reporte-medico__header">
        <img src={logoIMSS} alt="Logo IMSS" className="reporte-medico__header-logo" />
        <div className="reporte-medico__header-texts">
          <h1 className="reporte-medico__welcome-message">Sistema de Gestión de Reportes Médicos</h1>
          <h2 className="reporte-medico__department-name">Generar informe de médicos registrados</h2>
        </div>
      </header>
      
      <div className="reporte-medico__content">
        <div className="reporte-medico__busqueda">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <select value={searchField} onChange={handleFieldChange}>
            <option value="nombre">Nombre</option>
            <option value="apellidoPaterno">Apellido Paterno</option>
            <option value="apellidoMaterno">Apellido Materno</option>
          </select>
        </div>
        <button onClick={generatePDF} className="reporte-medico__pdf-button">Imprimir Reporte en PDF</button>
        <div className="reporte-medico__table-container">
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <>
              <div className="reporte-medico__table-wrapper">
                <table className="reporte-medico__table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Apellido Paterno</th>
                      <th>Apellido Materno</th>
                      <th>Especialidad</th>
                      <th>Matrícula</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMedicos.map(medico => (
                      <tr key={medico.id_medico}>
                        <td>{medico.nombre_medico}</td>
                        <td>{medico.apellido_paterno_medico}</td>
                        <td>{medico.apellido_materno_medico}</td>
                        <td>{medico.especialidad}</td>
                        <td>{medico.matricula}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="reporte-medico__pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`reporte-medico__pagination-button ${page === currentPage ? 'reporte-medico__pagination-button--active' : ''}`}
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

export default ReporteMedicos;