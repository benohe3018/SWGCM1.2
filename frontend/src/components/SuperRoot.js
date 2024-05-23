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
          <li><Link to="/crud-medicos">Módulo de Médicos</Link></li>
          <li><Link to="/crud-usuarios">Módulo de Usuarios</Link></li>
          <li><Link to="/informes-medicos">Módulo de Informes</Link></li>
          <li><Link to="/gestion-citas">Módulo de Citas</Link></li>
          <li><Link to="/estudios-radiologicos">Modulo de Estudios Radiológicos</Link></li>
          <li><Link to="/admin">Modulo de Administración</Link></li>
        </ul>
      </nav>
      <main className="super-root-content">
        <img src={mrMachine} alt="Máquina de resonancia magnética" className="mr-machine" />
      </main>
    </div>
  );
}

export default SuperRoot;
