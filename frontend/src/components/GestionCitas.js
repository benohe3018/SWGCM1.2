// GestionCitas.js
import React from 'react';
import './GestionCitas.css'; // Asegúrate de crear este archivo CSS
import logoIMSS from '../images/LogoIMSS.jpg';

const GestionCitas = () => {
  return (
    <div>
      <header className="gestion-citas-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <h1 className="welcome-message">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
        <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
      </header>
      <h3 className="en-construccion-message">Esta página está en construcción.</h3>
    </div>
    
  );
};

export default GestionCitas;