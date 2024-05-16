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
      <nav className="navbar">
        <div className="logo">IMSS</div>
        <ul className="nav-links">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/create-medico">Capturar nuevo Medico</Link></li>
          <li><Link to="/read-medico">Ver Medicos</Link></li>
          <li><Link to="/update-medico">Actualizar Registro de Médico</Link></li>
          <li><Link to="/delete-medico">Borrar Registro de Médico</Link></li>
          <li><Link to="/dashboard-root">Módulo de Administración</Link></li>
        </ul>
        <div className="hamburger">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </nav>
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
      <script src="script.js"></script> 
    </div>
  );
};

export default CRUDMedicos;