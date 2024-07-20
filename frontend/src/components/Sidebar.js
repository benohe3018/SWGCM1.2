import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [openSubmenu, setOpenSubmenu] = useState({
    medicos: false,
    usuarios: false,
    citas: false,
    estudios: false
  });

  const handleSubmenuToggle = (menu) => {
    setOpenSubmenu(prevState => ({
      ...prevState,
      [menu]: !prevState[menu]
    }));
  };

  return (
    <div className="sidebar">
      <h2>Bienvenido</h2>
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
        <li onClick={() => handleSubmenuToggle('citas')}>
          <span>Módulo de Citas</span>
          <span className={`arrow ${openSubmenu.citas ? 'open' : ''}`}>&#9660;</span>
          {openSubmenu.citas && (
            <ul className="submenu">
              <li><Link to="/crear-cita">Capturar Nueva Cita</Link></li>
              <li><Link to="/ver-citas">Ver Citas</Link></li>
              <li><Link to="/ver-citas">Editar Cita</Link></li>
              <li><Link to="/ver-citas">Eliminar Cita</Link></li>
              <li><Link to="/">Salir</Link></li>
            </ul>
          )}
        </li>
        <li onClick={() => handleSubmenuToggle('estudios')}>
          <span>Módulo de Estudios Radiológicos</span>
          <span className={`arrow ${openSubmenu.estudios ? 'open' : ''}`}>&#9660;</span>
          {openSubmenu.estudios && (
            <ul className="submenu">
              <li><Link to="/crear-estudio">Capturar Nuevo Estudio</Link></li>
              <li><Link to="/ver-estudios">Ver Estudios</Link></li>
              <li><Link to="/ver-estudios">Editar Estudio</Link></li>
              <li><Link to="/ver-estudios">Eliminar Estudio</Link></li>
              <li><Link to="/">Salir</Link></li>
            </ul>
          )}
        </li>
        <li><Link to="/informes-medicos">Módulo de Informes</Link></li>
        <li><Link to="/admin">Modulo de Administración</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;











