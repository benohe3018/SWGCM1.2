import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import SuperRoot from './components/SuperRoot';
import Administrador from './components/Administrador';
import CRUDMedicos from './components/CRUDMedicos';
import CreateMedico from './components/CreateMedico';
import ReadMedico from './components/ReadMedico';
import UpdateMedico from './components/UpdateMedico';
import DeleteMedico from './components/DeleteMedico';
import CRUDUsuarios from './components/CRUDUsuarios';
import CreateUsuario from './components/CreateUsuario';
import GestionCitas from './components/GestionCitas';
import InformeMedicos from './components/InformesMedicos';
import Usuarios from './components/Usuarios';
import EstudiosRadiologicos from './components/EstudiosRadiologicos';
import ReadUsuario from './components/ReadUsuario';
import UpdateUsuario from './components/UpdateUsuario';
import DeleteUsuario from './components/DeleteUsuario';
import Admin from './components/Admin';
import UsuarioDeCampo from './components/UsuarioDeCampo';
import './App.css';

function App() {
  return (
    <Router>
      <div className="main-layout">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard-root" element={<SuperRoot />} />
            <Route path="/dashboard-admin" element={<Administrador />} />
            <Route path="/crud-medicos" element={<CRUDMedicos />} />
            <Route path="/create-medico" element={<CreateMedico />} />
            <Route path="/read-medico" element={<ReadMedico />} />
            <Route path="/update-medico" element={<UpdateMedico />} />
            <Route path="/delete-medico" element={<DeleteMedico />} />
            <Route path="/crud-usuarios" element={<CRUDUsuarios />} />
            <Route path="/create-usuario" element={<CreateUsuario />} />
            <Route path="/gestion-citas" element={<GestionCitas />} />
            <Route path="/crear-cita" element={<GestionCitas />} />
            <Route path="/ver-citas" element={<GestionCitas />} />
            <Route path="/informes-medicos" element={<InformeMedicos />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/crear" element={<EstudiosRadiologicos />} />
            <Route path="/ver" element={<EstudiosRadiologicos />} />
            <Route path="/read-usuario" element={<ReadUsuario />} />
            <Route path="/update-usuario" element={<UpdateUsuario />} />
            <Route path="/delete-usuario" element={<DeleteUsuario />} />
            <Route path="/dashboard-user-admin" element={<Admin />} />
            <Route path="/dashboard-field-user" element={<UsuarioDeCampo />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

