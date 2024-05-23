import React from 'react';
import { Link } from 'react-router-dom';
import './SuperRoot.css';
import logoIMSS from '../images/LogoIMSS.jpg';
import mrMachine from '../images/MRMachine.jpg';

const SuperRoot = () => {
  return (
    <div className="super-root-page">
      <header className="super-root-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
          <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
        </div>
      </header>
      <nav className="navbar">
        <ul className="nav-links">
          <li><Link to="/crud-medicos">Cambiar Sesión</Link></li>
          <li><Link to="/crud-medicos">Capturar Nuevo Medico</Link></li>
          <li><Link to="/ver-medicos">Ver Medicos</Link></li>
          <li><Link to="/actualizar-medico">Actualizar Registro de Médico</Link></li>
          <li><Link to="/borrar-medico">Borrar Registro de Médico</Link></li>
          <li><Link to="/dashboard-root">Página de Inicio</Link></li>
        </ul>
      </nav>
      <main className="super-root-content">
        <img src={mrMachine} alt="Máquina de resonancia magnética" className="mr-machine" />
      </main>
    </div>
  );
}

export default SuperRoot;

