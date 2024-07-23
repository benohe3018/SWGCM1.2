import React, { useState } from 'react';
import './CreateMedico.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const CreateMedico = () => {
  const [nombreMedico, setNombreMedico] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [matricula, setMatricula] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const especialidades = [
    'Seleccione una especialidad',
    'Traumatología',
    'Cardiología',
    'Cirugía',
    'Endocrinología',
    'Neurocirugía',
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

  const isValidName = (name) => /^[a-zA-ZÁÉÍÓÚáéíóúñÑ]+$/.test(name) && name.length >= 1 && name.length <= 50;

  const isValidMatricula = (matricula) => /^\d+$/.test(matricula) && matricula.length <= 12;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isValidName(nombreMedico)) {
      alert('Por favor, introduce un nombre válido (solo letras, 1-50 caracteres).');
      return;
    }

    if (!isValidName(apellidoPaterno)) {
      alert('Por favor, introduce un apellido paterno válido (solo letras, 1-50 caracteres).');
      return;
    }

    if (!isValidName(apellidoMaterno)) {
      alert('Por favor, introduce un apellido materno válido (solo letras, 1-50 caracteres).');
      return;
    }

    if (!isValidMatricula(matricula)) {
      alert('Por favor, introduce una matrícula válida (solo números, máximo 12 dígitos).');
      return;
    }

    if (especialidad === 'Seleccione una especialidad') {
      alert('Por favor, selecciona una especialidad válida.');
      return;
    }

    setIsSubmitting(true);

    // Verifica si la matrícula ya existe
    const responseCheck = await fetch(`${process.env.REACT_APP_API_URL}/api/medicos/matricula/${matricula}`);
    const dataCheck = await responseCheck.json();
    if (responseCheck.ok && Object.keys(dataCheck).length > 0) {
      alert('El médico con esta matrícula ya existe en la base de datos. Intente con un nuevo registro');
      setIsSubmitting(false);
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/medicos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre_medico: nombreMedico,
        apellido_paterno_medico: apellidoPaterno,
        apellido_materno_medico: apellidoMaterno,
        especialidad: especialidad,
        matricula: matricula
      })
    });

    if (response.ok) {
      setSuccessMessage('El registro se ha creado exitosamente');
      setNombreMedico('');
      setApellidoPaterno('');
      setApellidoMaterno('');
      setEspecialidad('');
      setMatricula('');
    } else {
      setSuccessMessage('Hubo un problema al crear el registro');
    }

    setIsSubmitting(false);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="create-medico-page">
      <header className="create-medico-header">
        <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
        <div className="header-texts">
          <h1 className="welcome-message">Bienvenido al Módulo de gestión de Médicos</h1>
          <h2 className="department-name">Crear Nuevos Registros de Médicos</h2>
        </div>
      </header>

      <div className="create-medico-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del Médico:</label>
            <input type="text" value={nombreMedico} onChange={(e) => setNombreMedico(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Apellido Paterno:</label>
            <input type="text" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Apellido Materno:</label>
            <input type="text" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Especialidad:</label>
            <select value={especialidad} onChange={(e) => setEspecialidad(e.target.value)}>
              {especialidades.map((esp, index) => (
                <option key={index} value={esp}>{esp}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Matrícula:</label>
            <input type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
          {successMessage && <p className='message-create-success'>{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateMedico;

