import React, { useState } from 'react';
import './BackupRecovery.css';

const BackupRecovery = () => {
  const [selectedModules, setSelectedModules] = useState([]);
  const [schedule, setSchedule] = useState('');

  const handleBackup = () => {
    if (selectedModules.length === 0) {
      alert('Por favor, seleccione los módulos a respaldar.');
      return;
    }
    // Lógica para realizar el backup de los módulos seleccionados
    selectedModules.forEach(module => {
      // Aquí llamas a las funciones de lectura de cada módulo
      console.log(`Realizando backup de: ${module}`);
    });
    alert('Backup realizado con éxito.');
  };

  const handleRestore = (event) => {
    const file = event.target.files[0];
    if (file) {
      alert('Datos restaurados con éxito.');
      // Lógica para restaurar los datos
    }
  };

  const handleModuleSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedModules(prevState =>
      checked ? [...prevState, value] : prevState.filter(module => module !== value)
    );
  };

  const handleScheduleChange = (event) => {
    setSchedule(event.target.value);
  };

  return (
    <div className="backup-recovery-page">
      <h1>Backup y Recuperación de Datos</h1>
      <div>
        <h2>Seleccione los módulos a respaldar:</h2>
        <label>
          <input type="checkbox" value="medicos" onChange={handleModuleSelection} />
          Médicos
        </label>
        <label>
          <input type="checkbox" value="usuarios" onChange={handleModuleSelection} />
          Usuarios
        </label>
        <label>
          <input type="checkbox" value="citas" onChange={handleModuleSelection} />
          Citas
        </label>
        <label>
          <input type="checkbox" value="estudios" onChange={handleModuleSelection} />
          Estudios Radiológicos
        </label>
        <label>
          <input type="checkbox" value="especialidades" onChange={handleModuleSelection} />
          Especialidades Médicas
        </label>
        <label>
          <input type="checkbox" value="unidades" onChange={handleModuleSelection} />
          Unidades de Medicina Familiar
        </label>
        <label>
          <input type="checkbox" value="diagnosticos" onChange={handleModuleSelection} />
          Diagnósticos Presuntivos
        </label>
        <label>
          <input type="checkbox" value="hospitales" onChange={handleModuleSelection} />
          Hospitales
        </label>
      </div>
      <div>
        <h2>Programar Backup:</h2>
        <input type="datetime-local" value={schedule} onChange={handleScheduleChange} />
      </div>
      <button onClick={handleBackup}>Realizar Backup</button>
      <input type="file" onChange={handleRestore} />
    </div>
  );
};

export default BackupRecovery;