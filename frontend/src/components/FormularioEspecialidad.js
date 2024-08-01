// src/components/FormularioEspecialidad.js

import React, { useState } from 'react';

const FormularioEspecialidad = ({ modo, especialidadInicial, onSubmit, onCancel }) => {
    const [nombreEspecialidad, setNombreEspecialidad] = useState(especialidadInicial ? especialidadInicial.nombre_especialidad : '');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ nombre_especialidad: nombreEspecialidad });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nombre de la Especialidad:</label>
                <input
                    type="text"
                    value={nombreEspecialidad}
                    onChange={(e) => setNombreEspecialidad(e.target.value)}
                    required
                />
            </div>
            <button type="submit">{modo === 'crear' ? 'Crear' : 'Actualizar'}</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
    );
};

export default FormularioEspecialidad;
