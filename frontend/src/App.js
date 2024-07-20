import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext'; // Importar el contexto de autenticación
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
import ActiveUser from './components/ActiveUser';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="main-layout">
        <ActiveUser />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard-root" element={<PrivateRoute><Sidebar /><SuperRoot /></PrivateRoute>} />
            <Route path="/dashboard-admin" element={<PrivateRoute><Sidebar /><Administrador /></PrivateRoute>} />
            <Route path="/crud-medicos" element={<PrivateRoute><Sidebar /><CRUDMedicos /></PrivateRoute>} />
            <Route path="/create-medico" element={<PrivateRoute><Sidebar /><CreateMedico /></PrivateRoute>} />
            <Route path="/read-medico" element={<PrivateRoute><Sidebar /><ReadMedico /></PrivateRoute>} />
            <Route path="/update-medico" element={<PrivateRoute><Sidebar /><UpdateMedico /></PrivateRoute>} />
            <Route path="/delete-medico" element={<PrivateRoute><Sidebar /><DeleteMedico /></PrivateRoute>} />
            <Route path="/crud-usuarios" element={<PrivateRoute><Sidebar /><CRUDUsuarios /></PrivateRoute>} />
            <Route path="/create-usuario" element={<PrivateRoute><Sidebar /><CreateUsuario /></PrivateRoute>} />
            <Route path="/gestion-citas" element={<PrivateRoute><Sidebar /><GestionCitas /></PrivateRoute>} />
            <Route path="/crear-cita" element={<PrivateRoute><Sidebar /><GestionCitas /></PrivateRoute>} />
            <Route path="/ver-citas" element={<PrivateRoute><Sidebar /><GestionCitas /></PrivateRoute>} />
            <Route path="/informes-medicos" element={<PrivateRoute><Sidebar /><InformeMedicos /></PrivateRoute>} />
            <Route path="/usuarios" element={<PrivateRoute><Sidebar /><Usuarios /></PrivateRoute>} />
            <Route path="/crear" element={<PrivateRoute><Sidebar /><EstudiosRadiologicos /></PrivateRoute>} />
            <Route path="/ver" element={<PrivateRoute><Sidebar /><EstudiosRadiologicos /></PrivateRoute>} />
            <Route path="/read-usuario" element={<PrivateRoute><Sidebar /><ReadUsuario /></PrivateRoute>} />
            <Route path="/update-usuario" element={<PrivateRoute><Sidebar /><UpdateUsuario /></PrivateRoute>} />
            <Route path="/delete-usuario" element={<PrivateRoute><Sidebar /><DeleteUsuario /></PrivateRoute>} />
            <Route path="/dashboard-user-admin" element={<PrivateRoute><Sidebar /><Admin /></PrivateRoute>} />
            <Route path="/dashboard-field-user" element={<PrivateRoute><Sidebar /><UsuarioDeCampo /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

