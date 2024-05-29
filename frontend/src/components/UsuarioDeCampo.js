// UsuarioDeCampo.js
import React from "react";
import './UsuarioDeCampo.css';
import { Link } from 'react-router-dom';
import logoIMSS from '../images/LogoIMSS.jpg';

const UsuarioDeCampo = () => {
    return (
        <div className="usuario-de-campo-page">
            <header className="usuario-de-campo-header">
                <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
                <h1 className="usuario-de-campo-welcome-message">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
                <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
            </header>
            <h3 className="usuario-de-campo-en-construccion-message">Esta página está en construcción.</h3>
            <Link to="/">
                <button className="usuario-de-campo-button">Volver al inicio de sesión</button>
            </Link>
        </div>
    );
};

export default UsuarioDeCampo;

