import React from 'react';
import './TablaEstudios.css';

const TablaEstudios = ({ estudios, onEditar, onEliminar }) => {
  
  if (!Array.isArray(estudios) || estudios.length === 0) {
    return <p>No hay estudios disponibles favor de capturar.</p>;
  }

  return (
    <div className="tabla-estudios-container">
      <table className="tabla-estudios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Estudio</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudios.map((estudio) => (
            <tr key={estudio.id}>
              <td>{estudio.id}</td> {/* Asegúrate de usar 'id' */}
              <td>{estudio.nombre_estudio}</td>
              <td>{estudio.descripcion_estudio}</td>
              <td>
                <button 
                  onClick={() => onEditar(estudio.id)}  
                  className="editar-button"
                >
                  Editar
                </button>
                <button 
                  onClick={() => onEliminar(estudio.id)}  
                  className="eliminar-button"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaEstudios;
