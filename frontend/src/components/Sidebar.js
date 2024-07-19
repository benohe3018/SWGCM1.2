import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [openSubmenu, setOpenSubmenu] = useState({
    medicos: false,
    usuarios: false
  });

  const handleSubmenuToggle = (menu) => {
    setOpenSubmenu(prevState => ({
      ...prevState,
      [menu]: !prevState[menu]
    }));
  };

  return (
    <div className="sidebar">
      <h2>Gestión de Citas</h2>
      <ul>
        <li onClick={() => handleSubmenuToggle('medicos')}>
          <span>Módulo de Médicos</span>
          <span className={`arrow ${openSubmenu.medicos ? 'open' : ''}`}>&#9660;</span>
          {openSubmenu.medicos && (
            <ul className="submenu">
              <li><Link to="/create-medico">Capturar Nuevo Médico</Link></li>
              <li><Link to="/read-medico">Ver Médicos</Link></li>
              <li><Link to="/update-medico">Actualizar Registro de Médico</Link></li>
              <li><Link to="/delete-medico">Borrar Registro de Médico</Link></li>
              <li><Link to="/">Salir</Link></li>
            </ul>
          )}
        </li>
        <li onClick={() => handleSubmenuToggle('usuarios')}>
          <span>Módulo de Usuarios</span>
          <span className={`arrow ${openSubmenu.usuarios ? 'open' : ''}`}>&#9660;</span>
          {openSubmenu.usuarios && (
            <ul className="submenu">
              <li><Link to="/create-usuario">Capturar Nuevo Usuario</Link></li>
              <li><Link to="/read-usuario">Ver Usuarios</Link></li>
              <li><Link to="/update-usuario">Actualizar Registro de Usuario</Link></li>
              <li><Link to="/delete-usuario">Borrar Registro de Usuario</Link></li>
              <li><Link to="/">Salir</Link></li>
            </ul>
          )}
        </li>
        <li><Link to="/informes-medicos">Módulo de Informes</Link></li>
        <li><Link to="/gestion-citas">Módulo de Citas</Link></li>
        <li><Link to="/estudios-radiologicos">Modulo de Estudios Radiológicos</Link></li>
        <li><Link to="/admin">Modulo de Administración</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;








