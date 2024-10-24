import React, { useState, useEffect } from 'react';
import './BackupRecovery.css';
import logoIMSS from '../images/LogoIMSS.jpg'; 
import Sidebar from './Sidebar';

const BackupRecovery = () => {
  const [selectedModules, setSelectedModules] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [citas, setCitas] = useState([]);
  const [estudios, setEstudios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [hospitales, setHospitales] = useState([]);

  const fetchData = async (endpoint, setData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${endpoint}`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };

  useEffect(() => {
    if (selectedModules.includes('medicos')) fetchData('medicos', setMedicos);
    if (selectedModules.includes('usuarios')) fetchData('usuarios', setUsuarios);
    if (selectedModules.includes('citas')) fetchData('citas', setCitas);
    if (selectedModules.includes('estudios')) fetchData('estudios', setEstudios);
    if (selectedModules.includes('especialidades')) fetchData('especialidades', setEspecialidades);
    if (selectedModules.includes('unidades')) fetchData('unidades', setUnidades);
    if (selectedModules.includes('diagnosticos')) fetchData('diagnosticos', setDiagnosticos);
    if (selectedModules.includes('hospitales')) fetchData('hospitales', setHospitales);
  }, [selectedModules]);

  const handleBackup = () => {
    if (selectedModules.length === 0) {
      alert('Por favor, seleccione los módulos a respaldar.');
      return;
    }
  
    selectedModules.forEach(module => {
      let data;
      switch (module) {
        case 'medicos':
          data = medicos;
          break;
        case 'usuarios':
          data = usuarios;
          break;
        case 'citas':
          data = citas;
          break;
        case 'estudios':
          data = estudios;
          break;
        case 'especialidades':
          data = especialidades;
          break;
        case 'unidades':
          data = unidades;
          break;
        case 'diagnosticos':
          data = diagnosticos;
          break;
        case 'hospitales':
          data = hospitales;
          break;
        default:
          return;
      }
  
      console.log(`Datos de ${module}:`, data); // Registro de depuración
  
      if (data.length === 0) {
        console.warn(`No hay datos para el módulo ${module}.`);
        return;
      }
  
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${module}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const handleRestore = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          let endpoint = '';
  
          // Determina el endpoint basado en el contenido del archivo
          if (data.length > 0) {
            if (data[0].nombre_medico) {
              endpoint = 'medicos';
            } else if (data[0].cita_id) {
              endpoint = 'usuarios';
            }else if (data[0].cita_id) {
              endpoint = 'citas';
            } else if (data[0].estudio_id) {
              endpoint = 'estudios';
            } else if (data[0].especialidad_id) {
              endpoint = 'especialidades';
            } else if (data[0].unidad_id) {
              endpoint = 'unidades';
            } else if (data[0].diagnostico_id) {
              endpoint = 'diagnosticos';
            } else if (data[0].hospital_id) {
              endpoint = 'hospitales';
            }
          }
  
          if (endpoint) {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${endpoint}/restore`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
  
            if (response.ok) {
              alert('Datos restaurados con éxito.');
            } else {
              alert('Error al restaurar los datos.');
            }
          } else {
            alert('Formato de archivo no reconocido.');
          }
        } catch (error) {
          console.error('Error al restaurar los datos:', error);
          alert('Error al restaurar los datos.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleModuleSelection = (event) => {
    const { value, checked } = event.target;
    setSelectedModules(prevState =>
      checked ? [...prevState, value] : prevState.filter(module => module !== value)
    );
  };

  return (
    <div className="backup-recovery">
      <header className="backup-recovery__header">
        <img src={logoIMSS} alt="Logo IMSS" className="backup-recovery__header-logo" />
        <div className="backup-recovery__header-texts">
          <h1 className="backup-recovery__welcome-message">Backup y Recuperación de Datos</h1>
          <h2 className="backup-recovery__department-name">Departamento de Resonancia Magnética - HGR #46</h2>
        </div>
      </header>
      <div className="main-layout">
        <Sidebar />
        <div className="backup-recovery__content">
          <h3 className="backup-recovery__form-description">Seleccione los módulos a respaldar:</h3>
          <div className="backup-recovery__form-group">
            {['medicos', 'usuarios', 'citas', 'estudios', 'especialidades', 'unidades', 'diagnosticos', 'hospitales'].map(module => (
              <label key={module} className="backup-recovery__form-label">
                <input type="checkbox" value={module} onChange={handleModuleSelection} />
                {module.charAt(0).toUpperCase() + module.slice(1)}
              </label>
            ))}
          </div>
          <button className="backup-recovery__button" onClick={handleBackup}>Realizar Backup</button>
          <input type="file" className="backup-recovery__file-input" onChange={handleRestore} />
          <button className="backup-recovery__button" onClick={handleRestore}>Restaurar Datos</button>
        </div>
      </div>
    </div>
  );
};

export default BackupRecovery;