import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Asegúrate de importar useNavigate
import { useAuth } from './AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [openSubmenu, setOpenSubmenu] = useState({
    medicos: false,
    usuarios: false,
    citas: false,
    estudios: false
  });

  const navigate = useNavigate();

  const handleSubmenuToggle = (menu) => {
    setOpenSubmenu(prevState => ({
      ...prevState,
      [menu]: !prevState[menu]
    }));
  };

  const handleChangeSession = () => {
    navigate('/');
  };

  const handleExitSystem = () => {
    window.close();
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
              <li><Link to="/update-estudio">Editar Estudio</Link></li>
              <li><Link to="/delete-estudio">Eliminar Estudio</Link></li>
            </ul>
          )}
        </li>
        <li onClick={() => handleSubmenuToggle('especialidades')}>
          <span>Módulo de Especialidades Médicas</span>
          <span className={`arrow ${openSubmenu.especialidades ? 'open' : ''}`}>&#9660;</span>
          {openSubmenu.especialidades && (
            <ul className="submenu">
              <li><Link to="/crear-especialidad">Capturar Nueva Especialidad</Link></li>
              <li><Link to="/ver-especialidades">Ver Especialidades</Link></li>
              <li><Link to="/update-especialidad">Editar Especialidad</Link></li>
              <li><Link to="/delete-especialidad">Eliminar Especialidad</Link></li>
            </ul>
          )}
        </li>
        <li onClick={() => handleSubmenuToggle('unidades')}>
          <span>Módulo de Unidades de Medicina Familiar</span>
          <span className={`arrow ${openSubmenu.unidades ? 'open' : ''}`}>&#9660;</span>
          {openSubmenu.unidades && (
            <ul className="submenu">
              <li><Link to="/crear-unidad">Capturar Nueva Unidad</Link></li>
              <li><Link to="/ver-unidades">Ver Unidades</Link></li>
              <li><Link to="/update-unidad">Actualizar Unidad</Link></li>
              <li><Link to="/delete-unidad">Eliminar Unidad</Link></li>
            </ul>
          )}
        </li>
        <li onClick={() => handleSubmenuToggle('diagnosticos')}>
          <span>Módulo de Diagnósticos Presuntivos</span>
          <span className={`arrow ${openSubmenu.diagnosticos ? 'open' : ''}`}>&#9660;</span>
          {openSubmenu.diagnosticos && (
            <ul className="submenu">
              <li><Link to="/crear-diagnostico">Capturar Nuevo Diagnóstico</Link></li>
              <li><Link to="/ver-diagnosticos">Ver Diagnósticos</Link></li>
              <li><Link to="/update-diagnostico">Editar Diagnóstico</Link></li>
              <li><Link to="/delete-diagnostico">Eliminar Diagnóstico</Link></li>
            </ul>
          )}
        </li>
        <li onClick={() => handleSubmenuToggle('hospitales')}> 
          <span>Módulo de Hospitales</span>  
          <span className={`arrow ${openSubmenu.hospitales ? 'open' : ''}`}>&#9660;</span>  
          {openSubmenu.hospitales && (
            <ul className="submenu">
              <li><Link to="/crear-hospital">Capturar Nuevo Hospital</Link></li>
              <li><Link to="/ver-hospitales">Ver Hospitales</Link></li>
              <li><Link to="/update-hospital">Actualizar Hospital</Link></li>
              <li><Link to="/delete-hospital">Eliminar Hospital</Link></li>
            </ul>
          )}
        </li>
        <li><Link to="/informes-medicos">Módulo de Informes</Link></li>
        <li><Link to="/admin">Modulo de Administración</Link></li>
        <li><button onClick={handleChangeSession} className="sidebar-button">Cambiar Sesión</button></li>
        <li><button onClick={handleExitSystem} className="sidebar-button">Cerrar Página</button></li>
      </ul>
      {user && (
        <div className="active-user">
          <p>Usuario activo: {user.username} ({user.role})</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;











