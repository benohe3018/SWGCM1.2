import React, { useState, useEffect } from 'react';

const LogsViewer = () => {
  const [logs, setLogs] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/logs');
        const data = await response.json();
        setLogs(data.logs);
      } catch (error) {
        console.error('Error al obtener los logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="logs-viewer">
      <h1>Registro de Actividad del Sistema</h1>
      {loading ? (
        <p>Cargando logs...</p>
      ) : (
        <pre>{logs}</pre>
      )}
    </div>
  );
};

export default LogsViewer;