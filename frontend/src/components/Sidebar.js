import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Gestión de Citas</h2>
      <ul>
        <li>
          <Link to="#">Módulo de Médicos</Link>
          <ul>
            <li><Link to="/create-medico">Capturar Nuevo Médico</Link></li>
            <li><Link to="/read-medico">Ver Médicos</Link></li>
            <li><Link to="/update-medico">Actualizar Registro de Médico</Link></li>
            <li><Link to="/delete-medico">Borrar Registro de Médico</Link></li>
            <li><Link to="/">Salir</Link></li>
          </ul>
        </li>
        <li><Link to="/crud-usuarios">Módulo de Usuarios</Link></li>
        <li><Link to="/informes-medicos">Módulo de Informes</Link></li>
        <li><Link to="/gestion-citas">Módulo de Citas</Link></li>
        <li><Link to="/estudios-radiologicos">Modulo de Estudios Radiológicos</Link></li>
        <li><Link to="/admin">Modulo de Administración</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;


