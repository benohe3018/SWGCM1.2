import React, { useState, useEffect } from "react";
import './InformesMedicos.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const InformesMedicos = () => {
    const [citas, setCitas] = useState([]);
    const hospitalId = "ID_DEL_HOSPITAL"; // Reemplaza con el ID del hospital deseado

    const fetchCitas = async (hospitalId) => {
        try {
            const response = await fetch(`/api/pacientes_prueba?hospital_envia=${hospitalId}`);
            const data = await response.json();
            setCitas(data);
        } catch (error) {
            console.error("Error fetching citas:", error);
        }
    };

    useEffect(() => {
        fetchCitas(hospitalId);
    }, [hospitalId]);

    return (
        <div>
            <header className="informes-citas-header">
                <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
                <h1 className="welcome-message">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
                <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
            </header>
            <div>
                {citas.map(cita => (
                    <div key={cita.id}>
                        <p>{cita.nombre_completo}</p>
                        {/* Muestra más detalles de la cita aquí */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InformesMedicos;