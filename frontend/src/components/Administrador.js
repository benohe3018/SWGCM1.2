// Administrador.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Administrador.css';
import './main-layout.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const Administrador = () => {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <h1 className="welcome-message-admin">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
        <h2 className="department-name-admin">Departamento de Resonancia Magnética - HGR #46</h2>
      </header>
      <h3 className="en-construction-message-admin">Esta página está en construcción.</h3>
      <Link to="/">
        <button className="admin-button">Volver al inicio de sesión</button>
      </Link>
    </div>
  );
};

export default Administrador;