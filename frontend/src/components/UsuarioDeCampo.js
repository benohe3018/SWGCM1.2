//UsuarioDeCampo.js
import React from 'react';
import './UsuarioDeCampo.css'; // Asegúrate de crear este archivo CSS
import logoIMSS from '../images/LogoIMSS.jpg';

const UsuarioDeCampo = () => {
    return (
        <div className="usuario-de-campo-page">
        <header className="usuario-de-campo-header">
            <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
            <h1 className="welcome-message">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
            <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
        </header>
        <main className="usuario-de-campo-content">
            <p>Sitio en Construcción.</p>
        </main>
        </div>
    );

    };
    export default UsuarioDeCampo;

