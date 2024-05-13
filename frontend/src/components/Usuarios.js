//Usuarios.js
import React from "react";
import './Usuarios.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const Usuarios = () => {
    return (
        <div>
            <header className="usuarios-citas-header">
                <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
                <h1 className="welcome-message">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
                <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
            </header>
            <h3 className="en-construccion-message">Esta página está en construcción.</h3>
        </div>
    );
};

export default Usuarios;