import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';// Asegúrate de que la ruta al logo es correcta
import './CreateUsuario.css';
import './main-layout.css';
import logoIMSS from '../images/LogoIMSS.jpg';  // Asegúrate de que la ruta al logo es correcta
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importa los iconos de ojo

const CreateUsuario = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmContraseña, setConfirmContraseña] = useState(''); // Nuevo estado para la confirmación de la contraseña
  const [rol, setRol] = useState('');
  const [nombreReal, setNombreReal] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [matricula, setMatricula] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado para mostrar u ocultar la contraseña

  const isValidName = (name) => {
    const regex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/;
    return regex.test(name) && name.length >= 2 && name.length <= 50;
  };

  const isValidMatricula = (matricula) => {
    const regex = /^[0-9]{1,12}$/; // La matrícula debe ser un número de hasta 12 dígitos
    return regex.test(matricula);
  };

  const isValidUsername = (username) => {
    // Verifica la longitud del nombre de usuario
    if (username.length < 4 || username.length > 20) {
      return false;
    }
  
    // Verifica que el nombre de usuario no sea solo números
    if (/^\d+$/.test(username)) {
      return false;
    }
  
    // Verifica que el nombre de usuario no contenga una secuencia de caracteres especiales
    if (/^[.,]+$/.test(username)) {
      return false;
    }
  
    // Verifica que el nombre de usuario no sea solo espacios en blanco
    if (/^\s+$/.test(username)) {
      return false;
    }
  
    // Verifica que el nombre de usuario contenga solo caracteres alfanuméricos y algunos caracteres especiales permitidos (por ejemplo, guiones y guiones bajos)
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return false;
    }
  
    return true;
  };

  const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
  const [passwordMatchMessage, setPasswordMatchMessage] = useState('');

  const validatePassword = (password) => {
    let message = '';
    if (password.length < 8 || password.length > 50) {
      message = 'La contraseña debe tener entre 8 y 50 caracteres.';
    } else if (/^\d+$/.test(password)) {
      message = 'La contraseña no puede ser solo números.';
    } else if (/^[^a-zA-Z0-9]+$/.test(password)) {
      message = 'La contraseña no puede contener solo caracteres especiales o espacios.';
    } else if (!/[a-zA-Z]/.test(password)) {
      message = 'La contraseña debe contener al menos una letra.';
    } else if (!/\d/.test(password)) {
      message = 'La contraseña debe contener al menos un número.';
    }
    setPasswordValidationMessage(message);
    return message === '';
  };
  
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setContraseña(newPassword);
    validatePassword(newPassword);
  };
  
  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setConfirmContraseña(confirmPassword);
    if (contraseña !== confirmPassword) {
      setPasswordMatchMessage('Las contraseñas no coinciden.');
    } else {
      setPasswordMatchMessage('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verifica si las contraseñas coinciden
    if (contraseña !== confirmContraseña) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    // Valida los campos de entrada
    if (!isValidUsername(nombreUsuario)) {
      alert('Por favor, introduce un nombre de usuario válido deben ser caracteres alfanumericos (4-20 caracteres).');
      return;
    }
    if (!validatePassword(contraseña)) {
      alert('Por favor, introduce una contraseña válida (8-50 caracteres).');
      return;
    }
    if (!isValidName(nombreReal)) {
      alert('Error, Por favor introduce un nombre válido solo Letras y espacios (2-50 caracteres).');
      return;
    }
    if (!isValidName(apellidoPaterno)) {
      alert('Por favor, introduce un apellido paterno válido (2-50 caracteres).');
      return;
    }
    if (!isValidName(apellidoMaterno)) {
      alert('Por favor, introduce un apellido materno válido (2-50 caracteres).');
      return;
    }
    if (!isValidMatricula(matricula)) {
      alert('Por favor, introduce una matrícula válida.');
      return;
    }

    // Verifica si la matrícula ya existe
    const responseCheck = await fetch(`${process.env.REACT_APP_API_URL}/api/usuarios/matricula/${matricula}`);
    const dataCheck = await responseCheck.json();
    if (responseCheck.ok && Object.keys(dataCheck).length > 0) {
      alert('El usuario ya existe en la base de datos. Intente con un nuevo registro');
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
          contraseña: contraseña, 
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

  useEffect(() => {
    if (submitSuccess !== null) {
      const timer = setTimeout(() => {
        setSubmitSuccess(null);
      }, 5000); // Oculta el mensaje después de 5 segundos

      return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta o si submitSuccess cambia
    }
  }, [submitSuccess]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); 
  };

  const roles = [
    'root',
    'Admin',
    'Usuario_administrador',
    'Usuario_de_Campo',
  ];
  
  return (
    <div className="create-usuario-page">
      <header className="create-usuario-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message-create-usuario">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
          <h2 className="department-name-create-usuario">Departamento de Resonancia Magnética - HGR #46</h2>
        </div>
      </header>
      <div className="main-layout">
        <Sidebar />
        <div className="create-usuario-content">
          <form onSubmit={handleSubmit}>
            <h3 className="form-description-create-usuario">Capture los datos del Usuario</h3>
            <div className="form-group-create-usuario">
              <label htmlFor="nombreUsuario">Nombre de Usuario:</label>
              <input type="text" id="nombreUsuario" value={nombreUsuario} onChange={e => setNombreUsuario(e.target.value)} placeholder="Nombre de Usuario" />
            </div>
            <div className="password-container-form-group">
              <label htmlFor="contraseña">Contraseña:</label>
              <input type={showPassword ? "text" : "password"} id="contraseña" value={contraseña} onChange={handlePasswordChange} placeholder="Mayusculas, minusculas y numeros" />
              <button type="button" onClick={toggleShowPassword} className="toggle-show-password">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {passwordValidationMessage && <p className="validation-message">{passwordValidationMessage}</p>}
            </div>
            <div className="password-container-form-group">
              <label htmlFor="confirmContraseña">Confirmar Contraseña:</label>
              <input type={showPassword ? "text" : "password"} id="confirmContraseña" value={confirmContraseña} onChange={handleConfirmPasswordChange} placeholder="Mayusculas, minusculas y numeros" />
              <button type="button" onClick={toggleShowPassword} className="toggle-show-password">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {passwordMatchMessage && <p className="validation-message">{passwordMatchMessage}</p>}
            </div>
            <div className="form-group-create-usuario">
              <label htmlFor="nombreReal">Nombre Real:</label>
              <input type="text" id="nombreReal" value={nombreReal} onChange={e => setNombreReal(e.target.value)} placeholder="Nombre Real" />
            </div>
            <div className="form-group-create-usuario">
              <label htmlFor="apellidoPaterno">Apellido Paterno:</label>
              <input type="text" id="apellidoPaterno" value={apellidoPaterno} onChange={e => setApellidoPaterno(e.target.value)} placeholder="Apellido Paterno" />
            </div>
            <div className="form-group-create-usuario">
              <label htmlFor="apellidoMaterno">Apellido Materno:</label>
              <input type="text" id="apellidoMaterno" value={apellidoMaterno} onChange={e => setApellidoMaterno(e.target.value)} placeholder="Apellido Materno" />
            </div>
            <div className="form-group-create-usuario">
              <label htmlFor="matricula">Matrícula del Usuario:</label>
              <input type="text" id="matricula" value={matricula} onChange={e => setMatricula(e.target.value)} placeholder="Matrícula del Usuario" />
            </div>
            <div className="form-group-create-usuario">
              <label htmlFor="rol">Rol:</label>
              <select id="rol" value={rol} onChange={e => setRol(e.target.value)}>
                <option value="">Seleccione un rol</option>
                {roles.map(rol => (
                  <option key={rol} value={rol}>{rol}</option>
                ))}
              </select>
            </div>
            <button className="create-usuario-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
            {submitSuccess === true && <p className='message-POST-success'>El registro ha sido exitoso.</p>}
            {submitSuccess === false && <p className='message-POST-failed'>El registro no ha sido exitoso.</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUsuario;

