// Administrador.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Administrador.css'; // Asegúrate de crear este archivo CSS
import logoIMSS from '../images/LogoIMSS.jpg';

const Administrador = () => {
  return (
    <div className="administrador-page">
      <header className="administrador-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <h1 className="welcome-message">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
        <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
      </header>
      <main className="administrador-content">
        <p>Bienvenido al panel de administración del usuario administrador.</p>
        <Link to="/gestion-citas">
          <button className="administrator-button">Gestión de Citas</button>
        </Link>
        <Link to="/informes-medicos">
          <button className="administrator-button">Informes</button>
        </Link>
        <Link to="/usuarios">
          <button className="administrator-button">Usuarios</button>
        </Link>
        <Link to="/estudios-radiologicos">
          <button className="administrator-button">Estudios Radiológicos</button>
        </Link>
      </main>
    </div>
  );
};

export default Administrador;