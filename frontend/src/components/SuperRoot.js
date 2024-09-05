import React from 'react';
import Sidebar from './Sidebar';
import './SuperRoot.css';
import logoIMSS from '../images/LogoIMSS.jpg';
import mrMachine from '../images/MRMachine.jpg';

const SuperRoot = () => {
  return (
    <div className="super-root">
      <Sidebar />
      <div className="super-root__content-area">
        <header className="super-root__header">
          <div className="super-root__header-content"> {/* Contenedor para logo y textos */}
            <img src={logoIMSS} alt="Logo IMSS" className="super-root__header-logo" />
            <div className="super-root__header-texts">
              <h1 className="super-root__welcome-message">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
              <h2 className="super-root__department-name">Departamento de Resonancia Magnética - HGR #46</h2>
            </div>
          </div>
        </header>
        <main className="super-root__main">
          <img src={mrMachine} alt="Máquina de resonancia magnética" className="super-root__mr-machine" />
        </main>
      </div>
    </div>
  );
};

export default SuperRoot;



