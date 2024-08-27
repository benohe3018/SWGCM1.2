//Admin.js
import React from "react";
import './Admin.css';
import './main-layout.css';
import { Link } from 'react-router-dom';
import logoIMSS from '../images/LogoIMSS.jpg';

const Admin = () => {
    return (
        <div className="usuario-admin-page">
            <header className="usuario-admin-header">
                <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
                <h1 className="welcome-message">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
                <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
            </header>
            <h3 className="usuario-admin-en-construccion-message">Esta página está en construcción.</h3>
            <Link to="/">
                <button className="usuario-admin-button">Volver al inicio de sesión</button>
            </Link>
        </div>
    );
};

export default Admin;