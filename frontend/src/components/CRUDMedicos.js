// CRUDMedicos.js
import React from 'react';
import { Link } from 'react-router-dom';
import './CRUDMedicos.css';
import logoIMSS from '../images/LogoIMSS.jpg'; // Asegúrate de que la ruta al logo es correcta

const CRUDMedicos = () => {
  return (
    <div className="crud-medicos-page">
      <header className="crud-medicos-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
          <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
        </div>
      </header>
      <div className="crud-medicos-content">
        <Link to="/create-medico">
          <button className="crud-medicos-button">Capturar nuevo Medico</button>
        </Link>
        <Link to="/read-medico">
          <button className="crud-medicos-button">Ver Medicos</button>
        </Link>
        <Link to="/update-medico">
          <button className="crud-medicos-button">Actualizar Registro de Médico</button>
        </Link>
        <Link to="/delete-medico">
          <button className="crud-medicos-button">Borrar Registro de Médico</button>
        </Link>
        <Link to="/dashboard-root">
          <button className="crud-medicos-button">Ir a inicio</button>
        </Link>
      </div>
    </div>
  );
};

export default CRUDMedicos;