// CRUDUsuarios.js
import React from 'react';
import { Link } from 'react-router-dom';
import './CRUDUsuarios.css';
import logoIMSS from '../images/LogoIMSS.jpg'; // Asegúrate de que la ruta al logo es correcta

const CRUDUsuarios = () => {
  return (
    <div className="crud-usuarios-page">
      <header className="crud-usuarios-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
          <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
        </div>
      </header>
      <div className="crud-usuarios-content">
        <Link to="/create-usuario">
          <button className="crud-usuarios-button">Capturar nuevo Usuario</button>
        </Link>
        <Link to="/read-usuario">
          <button className="crud-usuarios-button">Ver Usuarios</button>
        </Link>
        <Link to="/update-usuario">
          <button className="crud-usuarios-button">Actualizar Registro de Usuario</button>
        </Link>
        <Link to="/delete-usuario">
          <button className="crud-usuarios-button">Borrar Registro de Usuario</button>
        </Link>
        <Link to="/dashboard-root">
          <button className="crud-medicos-button">Ir a inicio</button>
        </Link>
      </div>
    </div>
  );
};

export default CRUDUsuarios;