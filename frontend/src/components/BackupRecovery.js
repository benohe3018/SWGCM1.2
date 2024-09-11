import React from 'react';
import './BackupRecovery.css';

const BackupRecovery = () => {
  const handleBackup = () => {
    // Lógica para realizar el backup
    alert('Backup realizado con éxito.');
  };

  const handleRestore = () => {
    // Lógica para restaurar los datos desde un archivo de backup
    alert('Datos restaurados con éxito.');
  };

  return (
    <div className="backup-recovery-page">
      <h1>Backup y Recuperación de Datos</h1>
      <button onClick={handleBackup}>Realizar Backup</button>
      <input type="file" onChange={handleRestore} />
    </div>
  );
};

export default BackupRecovery;