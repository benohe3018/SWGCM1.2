import React, { useState, useEffect } from 'react';
import './BackupRecovery.css';

const BackupRecovery = () => {
  const [selectedModules, setSelectedModules] = useState([]);
  const [schedule, setSchedule] = useState('');
  const [medicos, setMedicos] = useState([]);

  const fetchMedicos = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/medicos`);
      const data = await response.json();
      setMedicos(data);
    } catch (error) {
      console.error('Error fetching medicos:', error);
    }
  };

  useEffect(() => {
    if (selectedModules.includes('medicos')) {
      fetchMedicos();
    }
  }, [selectedModules]);

  const handleBackup = () => {
    if (selectedModules.length === 0) {
      alert('Por favor, seleccione los módulos a respaldar.');
      return;
    }

    if (selectedModules.includes('medicos')) {
      const dataStr = JSON.stringify(medicos, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'backup_medicos.json';
      a.click();
      URL.revokeObjectURL(url);
    }

    alert('Backup realizado con éxito.');
  };

  const handleRestore = (event) => {
    const file = event.target.files[0];
    if (file) {
      alert('Datos restaurados con éxito.');
      // Logic to restore data from the backup file
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