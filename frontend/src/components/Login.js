import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { useAuth } from './AuthContext';
import './Login.css';
import './main-layout.css';
import logoIMSS from '../images/LogoIMSS.jpg';
import mrMachine from '../images/MRMachine.jpg';

const key = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_SECRET_KEY);
const iv = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_IV_KEY);

const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, key, { iv: iv, padding: CryptoJS.pad.Pkcs7 }).toString();
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Por favor ingresa tu nombre de usuario y contraseña.');
      return;
    }

    try {
      const encryptedPassword = encryptPassword(password);

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
        nombre_usuario: username,
        password: encryptedPassword,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      login(username, response.data.role);

      switch (response.data.role) {
        case 'Admin':
          navigate('/dashboard-root');
          break;
        case 'root':
          navigate('/dashboard-root');
          break;
        case 'Usuario_administrador':
          navigate('/dashboard-root');
          break;
        case 'Usuario_de_Campo':
          navigate('/dashboard-root');
          break;
        default:
          setError('Rol no reconocido. Acceso no permitido.');
          break;
      }
    } catch (error) {
      setError('Error al iniciar sesión. Por favor intente de nuevo');
    }
  };

  return (
    <div className="main-layout">
      <div className="login-page">
        <header className="login-header">
          <div className="header-left">
            <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
          </div>
          <div className="header-right">
            <h1 className="welcome-message">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
            <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
          </div>
        </header>
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Nombre de usuario:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit">Iniciar sesión</button>
          </form>
          <img src={mrMachine} alt="Máquina de resonancia magnética" className="mr-machine" />
        </div>
      </div>
    </div>
  );
};

export default Login;
