import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CreateUsuario.css';
import logoIMSS from '../images/LogoIMSS.jpg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const CreateUsuario = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmContraseña, setConfirmContraseña] = useState('');
  const [rol, setRol] = useState('');
  const [nombreReal, setNombreReal] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [matricula, setMatricula] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const isValidName = (name) => {
    const regex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/;
    return regex.test(name);
  };

  const isValidMatricula = (matricula) => {
    const regex = /^[0-9]{1,12}$/;
    return regex.test(matricula);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (contraseña !== confirmContraseña) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    if (!isValidName(nombreReal)) {
      alert('Por favor, introduce un nombre válido.');
      return;
    }
    if (!isValidName(apellidoPaterno)) {
      alert('Por favor, introduce un apellido paterno válido.');
      return;
    }
    if (!isValidName(apellidoMaterno)) {
      alert('Por favor, introduce un apellido materno válido.');
      return;
    }
    if (!isValidMatricula(matricula)) {
      alert('Por favor, introduce una matrícula válida.');
      return;
    }

    const responseCheck = await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios/matricula/${matricula}`);
    const dataCheck = await responseCheck.json();
    if (responseCheck.ok && Object.keys(dataCheck).length > 0) {
      alert('El usuario ya existe en la base de datos. Intente con un nuevo registro.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_usuario: nombreUsuario,
          contraseña: contraseña,  // Enviar la contraseña en texto plano
          rol,
          nombre_real: nombreReal,
          apellido_paterno: apellidoPaterno,
          apellido_materno: apellidoMaterno,
          matricula: matricula,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitSuccess(true);
        setNombreUsuario('');
        setContraseña('');
        setConfirmContraseña('');
        setRol('');
        setNombreReal('');
        setApellidoPaterno('');
        setApellidoMaterno('');
        setMatricula('');
      } else {
        setSubmitSuccess(false);
      }
    } catch (error) {
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const roles = [
    'Root',
    'Admin',
    'Usuario_administrador',
    'Usuario_de_Campo',
  ];

  return (
    <div className="create-usuario-page">
      <header className="create-usuario-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
          <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
        </div>
      </header>
      <nav className="navbar">
        <ul className="nav-links">
          <li><Link to="/">Cambiar Sesión</Link></li>
          <li><Link to="/create-usuario">Capturar Nuevo Usuario</Link></li>
          <li><Link to="/read-usuario">Ver usuarios</Link></li>
          <li><Link to="/update-usuario">Actualizar Registro de Usuario</Link></li>
          <li><Link to="/delete-usuario">Borrar Registro de Usuario</Link></li>
          <li><Link to="/dashboard-root">Página de Inicio</Link></li>
        </ul>
        <div className="hamburger">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </nav>
      <div className="create-usuario-content">
        <form onSubmit={handleSubmit}>
          <input type="text" value={nombreUsuario} onChange={e => setNombreUsuario(e.target.value)} placeholder="Nombre de Usuario" />
          <div className="password-container">
            <input type={showPassword ? "text" : "password"} value={contraseña} onChange={e => setContraseña(e.target.value)} placeholder="Contraseña" />
            <button type="button" onClick={toggleShowPassword} className="toggle-show-password">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="password-container">
            <input type={showPassword ? "text" : "password"} value={confirmContraseña} onChange={e => setConfirmContraseña(e.target.value)} placeholder="Confirmar Contraseña" />
            <button type="button" onClick={toggleShowPassword} className="toggle-show-password">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <input type="text" value={nombreReal} onChange={e => setNombreReal(e.target.value)} placeholder="Nombre Real" />
          <input type="text" value={apellidoPaterno} onChange={e => setApellidoPaterno(e.target.value)} placeholder="Apellido Paterno" />
          <input type="text" value={apellidoMaterno} onChange={e => setApellidoMaterno(e.target.value)} placeholder="Apellido Materno" />
          <input type="text" value={matricula} onChange={e => setMatricula(e.target.value)} placeholder="Matrícula del Usuario" />
          <select value={rol} onChange={e => setRol(e.target.value)}>
            <option value="">Seleccione un rol</option>
            {roles.map(rol => (
              <option key={rol} value={rol}>{rol}</option>
            ))}
          </select>
          <button className="create-usuario-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
          {submitSuccess === true && <p className='message-POST-success'>El registro ha sido exitoso.</p>}
          {submitSuccess === false && <p className='message-POST-failed'>El registro no ha sido exitoso.</p>}
        </form>
      </div>
      <script src="script.js"></script>
    </div>
  );
};

export default CreateUsuario;