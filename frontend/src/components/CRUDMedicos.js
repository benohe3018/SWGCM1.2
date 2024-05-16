import React from 'react';
import { Link } from 'react-router-dom';
import './CRUDMedicos.css';
import logoIMSS from '../images/LogoIMSS.jpg'; // Asegúrate de que la ruta al logo es correcta
import mrMachine from '../images/MRMachine.jpg';

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
      <nav className="navbar">
        <ul className="nav-links">
          <li><Link to="/">Cambiar Sesión</Link></li>
          <li><Link to="/create-medico">Capturar Nuevo Medico</Link></li>
          <li><Link to="/read-medico">Ver Medicos</Link></li>
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
      <div className="crud-medicos-content">
      <img src={mrMachine} alt="Logo IMSS" className="header-logo" />
      </div>
      <script src="script.js"></script> 
    </div>
  );
};

export default CRUDMedicos;