import React from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  return (
    <div className="admin-page">
      <h1>Módulo de Administración</h1>
      <ul>
        <li><Link to="/admin/backup-recovery">Backup y Recuperación de Datos</Link></li>
        {/* Aquí puedes añadir más opciones de administración */}
      </ul>
    </div>
  );
};

export default Admin;