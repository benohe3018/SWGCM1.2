import React, { useState } from 'react';
import './CreateMedicos.css'; 
import './main-layout.css';
import logoIMSS from '../images/LogoIMSS.jpg'; 
import Sidebar from './Sidebar';

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
    if (apellido === '') return true; 
    const regex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/; 
    return regex.test(apellido) && apellido.length <= 50;
  };

  const isValidMatricula = (matricula) => {
    const regex = /^[0-9]{1,12}$/; 
    return regex.test(matricula);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!isValidName(nombre)) {
      alert('Por favor, introduce un nombre válido (2-50 caracteres).');
      return;
    }
    if (!isValidApellido(apellidoPaterno)) {
      alert('Por favor, introduce un apellido paterno válido(El campo no debe de estar vacío).');
      return;
    }
    if (!isValidApellido(apellidoMaterno)) {
      alert('Por favor, introduce un apellido materno válido(El campo no debe de estar vacío).');
      return;
    }
    if (!isValidMatricula(matricula)) {
      alert('Por favor, introduce una matrícula válida.');
      return; 
    }
    if (!especialidad || especialidad === "Seleccione una especialidad") {
      alert('Por favor, selecciona una especialidad.');
      return; 
    }

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
  ];

  return (
    <div className="create-medico"> 
      <header className="create-medico__header">
        <img src={logoIMSS} alt="Logo IMSS" className="create-medico__header-logo" />
        <div className="create-medico__header-texts">
          <h1 className="create-medico__welcome-message">Sistema de Gestión de Médicos</h1>
          <h2 className="create-medico__department-name">Departamento de Resonancia Magnética - HGR #46</h2>
        </div>
      </header>
      <div className="main-layout"> 
        <Sidebar />
        <div className="create-medico__content"> 
          <form className="create-medico__form" onSubmit={handleSubmit}>
            <h3 className="create-medico__form-description">Capture los datos del Médico</h3>
            <div className="create-medico__form-group">
              <label htmlFor="nombre" className="create-medico__form-label">Nombre del Médico:</label>
              <input type="text" id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre del Médico" className="create-medico__form-input" />
            </div>
            <div className="create-medico__form-group">
              <label htmlFor="apellidoPaterno" className="create-medico__form-label">Apellido Paterno:</label>
              <input type="text" id="apellidoPaterno" value={apellidoPaterno} onChange={e => setApellidoPaterno(e.target.value)} placeholder="Apellido Paterno" className="create-medico__form-input" />
            </div>
            <div className="create-medico__form-group">
              <label htmlFor="apellidoMaterno" className="create-medico__form-label">Apellido Materno:</label>
              <input type="text" id="apellidoMaterno" value={apellidoMaterno} onChange={e => setApellidoMaterno(e.target.value)} placeholder="Apellido Materno" className="create-medico__form-input" />
            </div>
            <div className="create-medico__form-group">
              <label htmlFor="matricula" className="create-medico__form-label">Matrícula del Médico:</label>
              <input type="text" id="matricula" value={matricula} onChange={e => setMatricula(e.target.value)} placeholder="Matrícula" className="create-medico__form-input" />
            </div>
            <div className="create-medico__form-group">
              <label htmlFor="especialidad" className="create-medico__form-label">Especialidad:</label>
              <select id="especialidad" value={especialidad} onChange={e => setEspecialidad(e.target.value)} className="create-medico__form-select">
                <option value="">Seleccione</option>
                {especialidades.map(especialidad => (
                  <option key={especialidad} value={especialidad}>{especialidad}</option>
                ))}
              </select>
            </div>
            <button className="create-medico__button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
            {submitSuccess === true && <p className='create-medico__message-POST-success'>El registro ha sido exitoso.</p>}
            {submitSuccess === false && <p className='create-medico__message-POST-failed'>El registro no ha sido exitoso.</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMedico;