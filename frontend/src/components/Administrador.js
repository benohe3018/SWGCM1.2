// Administrador.js
import React from 'react';
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
      <h3 className="en-construction-message">Esta página está en construcción.</h3>
      
    </div>
  );
};

export default Administrador;