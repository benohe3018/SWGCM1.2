import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SuperRoot.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const SuperRoot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="super-root-page">
      <header className="super-root-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
          <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
        </div>
      </header>
      <main className="super-root-content">
        <p>Bienvenido al panel de administración del superusuario.</p>
        <div className="dropdown-container">
          <button onClick={toggleDropdown} className="dropdown-button">Menú de Opciones</button>
          {isOpen && (
            <div className="dropdown-content">
              <Link to="/crud-medicos" className="dropdown-item">Módulo de Médicos</Link>
              <Link to="/crud-usuarios" className="dropdown-item">Módulo de Usuarios</Link>
              <Link to="/informes-medicos" className="dropdown-item">Módulo de Informes</Link>
              <Link to="/gestion-citas" className="dropdown-item">Módulo de Citas</Link>
              <Link to="/estudios-radiologicos" className="dropdown-item">Modulo de Estudios Radiológicos</Link>
              <Link to="/admin" className="dropdown-item">Modulo de Administración</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SuperRoot;
