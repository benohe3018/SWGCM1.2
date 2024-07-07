import React from 'react';
import './TablaEstudios.css';

const TablaEstudios = ({ estudios, onEditar, onEliminar }) => {
  if (!Array.isArray(estudios) || estudios.length === 0) {
    return <p>No hay estudios disponibles. Favor de capturar.</p>;
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
            <tr key={estudio.id_estudio}>
              <td>{estudio.id_estudio}</td>
              <td>{estudio.nombre_estudio}</td>
              <td>{estudio.descripcion_estudio}</td>
              <td>
                <button 
                  onClick={() => onEditar(estudio.id_estudio)} 
                  className="editar-button"
                >
                  Editar
                </button>
                <button 
                  onClick={() => onEliminar(estudio.id_estudio)} 
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
