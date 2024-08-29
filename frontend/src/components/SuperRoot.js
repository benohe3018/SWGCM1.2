import React from 'react';
import Sidebar from './Sidebar';
import './SuperRoot.css';
import logoIMSS from '../images/LogoIMSS.jpg';
import mrMachine from '../images/MRMachine.jpg';

const SuperRoot = () => {
  return (
    <div className="super-root-page">
      <Sidebar />
      <div className="content-area">
        <header className="super-root-header">
          <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
          <div className="header-texts-superRoot">
            <h1 className="welcome-message-superRoot">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
            <h2 className="department-name-superRoot">Departamento de Resonancia Magnética - HGR #46</h2>
          </div>
        </header>
        <main className="super-root-content">
          <img src={mrMachine} alt="Máquina de resonancia magnética" className="mr-machine-superRoot" />
        </main>
      </div>
    </div>
  );
};

export default SuperRoot;



