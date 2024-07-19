import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const SideBar = () => {
  const [subMenuMedicos, setSubMenuMedicos] = useState(false);
  const [subMenuUsuarios, setSubMenuUsuarios] = useState(false);
  const [subMenuCitas, setSubMenuCitas] = useState(false);

  return (
    <div className="sidebar">
      <h2>Gestión de Citas</h2>
      <ul className="nav-links">
        <li>
          <div className="submenu-title" onClick={() => setSubMenuMedicos(!subMenuMedicos)}>
            Módulo de Médicos
            <span className="arrow">{subMenuMedicos ? '▲' : '▼'}</span>
          </div>
          {subMenuMedicos && (
            <ul className="submenu">
              <li><Link to="/create-medico">Capturar Nuevo Médico</Link></li>
              <li><Link to="/read-medico">Ver Médicos</Link></li>
              <li><Link to="/update-medico">Actualizar Registro de Médico</Link></li>
              <li><Link to="/delete-medico">Borrar Registro de Médico</Link></li>
              <li><Link to="/">Salir</Link></li>
            </ul>
          )}
        </li>
        <li>
          <div className="submenu-title" onClick={() => setSubMenuUsuarios(!subMenuUsuarios)}>
            Módulo de Usuarios
            <span className="arrow">{subMenuUsuarios ? '▲' : '▼'}</span>
          </div>
          {subMenuUsuarios && (
            <ul className="submenu">
              <li><Link to="/create-usuario">Capturar Nuevo Usuario</Link></li>
              <li><Link to="/read-usuario">Ver Usuarios</Link></li>
              <li><Link to="/update-usuario">Actualizar Registro de Usuario</Link></li>
              <li><Link to="/delete-usuario">Borrar Registro de Usuario</Link></li>
              <li><Link to="/">Salir</Link></li>
            </ul>
          )}
        </li>
        <li>
          <div className="submenu-title" onClick={() => setSubMenuCitas(!subMenuCitas)}>
            Módulo de Citas
            <span className="arrow">{subMenuCitas ? '▲' : '▼'}</span>
          </div>
          {subMenuCitas && (
            <ul className="submenu">
              <li><Link to="/crear-cita">Capturar Nueva Cita</Link></li>
              <li><Link to="/ver-citas">Ver/Editar/Eliminar Citas</Link></li>
              <li><Link to="/">Salir</Link></li>
            </ul>
          )}
        </li>
        <li><Link to="/dashboard-root">Página de Inicio</Link></li>
      </ul>
    </div>
  );
}

export default SideBar;









