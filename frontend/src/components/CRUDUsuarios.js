import React from 'react';
import { Link } from 'react-router-dom';
import './CRUDUsuarios.css';
import './main-layout.css';
import logoIMSS from '../images/LogoIMSS.jpg'; // Asegúrate de que la ruta al logo es correcta
import mrMachine from '../images/MRMachine.jpg';

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
      <nav className="navbar">
        <ul className="nav-links">
          <li><Link to="/">Cambiar Sesión</Link></li>
          <li><Link to="/create-usuario">Capturar Nuevo Usuario</Link></li>
          <li><Link to="/read-usuario">Ver Usuarios</Link></li>
          <li><Link to="/update-usuario">Actualizar Registro de Usuario</Link></li>
          <li><Link to="/delete-usuario">Borrar Registro de Usuario</Link></li>
          <li><Link to="/dashboard-root">Página de Inicio</Link></li>
        </ul>
        <div className="hamburger">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </nav>
      <div className="crud-usuarios-content">
        <img src={mrMachine} alt="Imagen Resonancia Magnética" className="header-logoMR" />
      </div>
      <script src="script.js"></script>
    </div>
  );
};

export default CRUDUsuarios;
