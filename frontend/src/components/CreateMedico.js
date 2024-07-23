import React, { useState } from 'react';
import './CreateMedicos.css';
import logoIMSS from '../images/LogoIMSS.jpg'; 
import Sidebar from './Sidebar';// Asegúrate de que la ruta al logo es correcta

const CreateMedico = () => {
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [matricula, setMatricula] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const isValidName = (name) => {
    const regex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/;
    return regex.test(name) && name.length >= 2 && name.length <= 50;
  };

  const isValidApellido = (apellido) => {
    if (apellido === '') return true; // Permite cadenas vacías
    const regex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]*$/; // Nota el asterisco (*) que permite cadenas de longitud cero
    return regex.test(apellido) && apellido.length <= 50;
  };

  const isValidMatricula = (matricula) => {
    const regex = /^[0-9]{1,12}$/; // La matrícula debe ser un número de hasta 12 dígitos
    return regex.test(matricula);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Valida los campos de entrada usando las funciones modificadas/creadas
    if (!isValidName(nombre)) {
      alert('Por favor, introduce un nombre válido (2-50 caracteres).');
      return;
    }
    if (!isValidApellido(apellidoPaterno)) {
      alert('Por favor, introduce un apellido paterno válido (puede estar vacío).');
      return;
    }
    if (!isValidApellido(apellidoMaterno)) {
      alert('Por favor, introduce un apellido materno válido (puede estar vacío).');
      return;
    }
    if (!isValidMatricula(matricula)) {
      alert('Por favor, introduce una matrícula válida.');
      return;
    }

    // Verifica si la matrícula ya existe
    const responseCheck = await fetch(`${process.env.REACT_APP_API_URL}/api/medicos/matricula/${matricula}`);
    const dataCheck = await responseCheck.json();
    if (responseCheck.ok && Object.keys(dataCheck).length > 0) {
      alert('El médico ya existe en la base de datos. Intente con un nuevo registro');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/medicos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido_paterno: apellidoPaterno,
          apellido_materno: apellidoMaterno,
          especialidad,
          matricula,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitSuccess(true);
        // Limpia los campos del formulario
        setNombre('');
        setApellidoPaterno('');
        setApellidoMaterno('');
        setEspecialidad('');
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

  const especialidades = [
    'Traumatología',
    'Cardiología',
    'Cirugia',
    'Endocrinología',
    'Neurocirugia',
    'Medicina interna',
    'Nefrología',
    'Neurología',
    'Oncología',
    'Pediatría',
    'Urología',
    'Salud en el trabajo',
    'Medicina de Urgencias',
    'Radiología'
    // Agrega más especialidades según sea necesario
  ];

  return (
    <div className="create-medico-page">
      <header className="create-medico-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
          <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
        </div>
      </header>
      <div className="main-layout">
        <Sidebar />
        <div className="create-medico-content">
          <form onSubmit={handleSubmit}>
            <h3 className="form-description">Capture los datos del Médico</h3>
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Médico:</label>
              <input type="text" id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre del Médico" />
            </div>
            <div className="form-group">
              <label htmlFor="apellidoPaterno">Apellido Paterno:</label>
              <input type="text" id="apellidoPaterno" value={apellidoPaterno} onChange={e => setApellidoPaterno(e.target.value)} placeholder="Apellido Paterno" />
            </div>
            <div className="form-group">
              <label htmlFor="apellidoMaterno">Apellido Materno:</label>
              <input type="text" id="apellidoMaterno" value={apellidoMaterno} onChange={e => setApellidoMaterno(e.target.value)} placeholder="Apellido Materno" />
            </div>
            <div className="form-group">
              <label htmlFor="matricula">Matrícula del Médico:</label>
              <input type="text" id="matricula" value={matricula} onChange={e => setMatricula(e.target.value)} placeholder="Matrícula del Médico" />
            </div>
            <div className="form-group">
              <label htmlFor="especialidad">Especialidad:</label>
              <select id="especialidad" value={especialidad} onChange={e => setEspecialidad(e.target.value)}>
                <option value="">Seleccione una especialidad</option>
                {especialidades.map(especialidad => (
                  <option key={especialidad} value={especialidad}>{especialidad}</option>
                ))}
              </select>
            </div>
            <button className="create-medico-button" type="submit" disabled={isSubmitting}>
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

export default CreateMedico;