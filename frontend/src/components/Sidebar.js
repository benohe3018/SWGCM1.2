import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [openSubmenu, setOpenSubmenu] = useState({
    medicos: false,
    usuarios: false,
    citas: false,
    estudios: false,
    especialidades: false,
    unidades: false,
    diagnosticos: false,
    hospitales: false,
    informes: false,
    admin: false,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleSubmenuToggle = (menu) => {
    setOpenSubmenu((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  const handleChangeSession = () => {
    logout();
    navigate('/');
  };

  const handleExitSystem = () => {
    window.close();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderMenu = (role) => {
    switch (role) {
      case 'root':
        return (
          <>
            {renderMedicosSubmenu()}
            {renderUsuariosSubmenu()}
            {renderCitasSubmenu()}
            {renderEstudiosSubmenu()}
            {renderEspecialidadesSubmenu()}
            {renderUnidadesSubmenu()}
            {renderDiagnosticosSubmenu()}
            {renderHospitalesSubmenu()}
            {renderInformesSubmenu()}
            {renderAdminSubmenu()}
          </>
        );
      case 'Admin':
        return (
          <>
            {renderMedicosSubmenu()}
            {renderCitasSubmenu()}
            {renderEstudiosSubmenu()}
            {renderEspecialidadesSubmenu()}
            {renderUnidadesSubmenu()}
            {renderDiagnosticosSubmenu()}
            {renderHospitalesSubmenu()}
            {renderInformesSubmenu()}
            {renderAdminSubmenu()}
          </>
        );
      case 'Usuario_administrador':
        return (
          <>
            {renderMedicosSubmenu()}
            {renderCitasSubmenu()}
            {renderEstudiosSubmenu()}
            {renderEspecialidadesSubmenu()}
            {renderUnidadesSubmenu()}
            {renderDiagnosticosSubmenu()}
            {renderHospitalesSubmenu()}
            {renderInformesSubmenu()}
          </>
        );
      case 'Usuario_de_Campo':
        return (
          <>
            {renderCitasSubmenu()}
          </>
        );
      default:
        return null;
    }
  };

  const renderMobileMenu = () => (
    <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
      <ul>
        {renderMenu(user && user.role)}
        <li>
          <button onClick={handleChangeSession} className="sidebar-button">
            Cambiar Sesión
          </button>
        </li>
        {/*<li>
          <button onClick={handleExitSystem} className="sidebar-button">
            Cerrar Página
          </button>
        </li>*/}
      </ul>
      {user && (
        <div className="active-user">
          <p>
            Usuario activo: {user.username} ({user.role})
          </p>
        </div>
      )}
    </div>
  );

  const renderMedicosSubmenu = () => (
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
  );

  const renderUsuariosSubmenu = () => (
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
  );

  const renderCitasSubmenu = () => (
    <li onClick={() => handleSubmenuToggle('citas')}>
      <span>Módulo de Citas</span>
      <span className={`arrow ${openSubmenu.citas ? 'open' : ''}`}>&#9660;</span>
      {openSubmenu.citas && (
        <ul className="submenu">
          <li><Link to="/crear-cita">Capturar Nueva Cita</Link></li>
          <li><Link to="/ver-citas">Ver Citas</Link></li>
          <li><Link to="/editar-citas">Editar Cita</Link></li>
          <li><Link to="/eliminar-citas">Eliminar Cita</Link></li>
        </ul>
      )}
    </li>
  );

  const renderEstudiosSubmenu = () => (
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
  );

  const renderEspecialidadesSubmenu = () => (
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
  );

  const renderUnidadesSubmenu = () => (
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
  );

  const renderDiagnosticosSubmenu = () => (
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
  );

  const renderHospitalesSubmenu = () => (
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
  );

  const renderInformesSubmenu = () => (
    <li onClick={() => handleSubmenuToggle('informes')}>
      <span>Módulo de Informes</span>
      <span className={`arrow ${openSubmenu.informes ? 'open' : ''}`}>&#9660;</span>
      {openSubmenu.informes && (
        <ul className="submenu">
          <li><Link to="/reporte-medicos">Reporte de Médicos</Link></li>
          <li><Link to="/reporte-usuarios">Reporte de Usuarios</Link></li>
          <li><Link to="/reporte-citas">Reporte de Citas</Link></li>
          <li><Link to="/reporte-estudios">Reporte de Estudios Radiológicos</Link></li>
          <li><Link to="/reporte-especialidades">Reporte de Especialidades Médicas</Link></li>
          <li><Link to="/reporte-umf">Reporte de Unidades de Medicina Familiar</Link></li>
          <li><Link to="/reporte-diagnosticos">Reporte de Diagnósticos Presuntivos</Link></li>
          <li><Link to="/reporte-hospitales">Reporte de Hospitales</Link></li>
        </ul>
      )}
    </li>
  );

  const renderAdminSubmenu = () => (
    <li onClick={() => handleSubmenuToggle('admin')}>
      <span>Módulo de Administración</span>
      <span className={`arrow ${openSubmenu.admin ? 'open' : ''}`}>&#9660;</span>
      {openSubmenu.admin && (
        <ul className="submenu">
          <li><Link to="/admin/backup-recovery">Backup y Recuperación de Datos</Link></li>
          {/* <li><Link to="/admin/logs">Ver Logs de la Aplicación</Link></li> */}          
        </ul>
      )}
    </li>
  );

  return (
    <div className="main-sidebar-container">
      {/* Sidebar fija para pantallas grandes */}
      <div className="sidebar">
        <h2>Bienvenido</h2>
        <ul>
          {renderMenu(user && user.role)}
          <li>
            <button onClick={handleChangeSession} className="sidebar-button">
              Cambiar Sesión
            </button>
          </li>
          {/*<li>
            <button onClick={handleExitSystem} className="sidebar-button">
              Cerrar Página
            </button>
          </li>*/}
        </ul>
        {user && (
          <div className="active-user">
            <p>
              Usuario activo: {user.username} ({user.role})
            </p>
          </div>
        )}
      </div>

      {/* Botón Hamburguesa para móviles */}
      <div className="hamburger" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <>
          {renderMobileMenu()}
          <div className="overlay" onClick={toggleMenu}></div>
        </>
      )}
    </div>
  );
};

export default Sidebar;