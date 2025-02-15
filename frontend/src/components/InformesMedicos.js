import React, { useState, useEffect } from "react";
import './InformesMedicos.css';
import logoIMSS from '../images/LogoIMSS.jpg';

const InformesMedicos = () => {
    const [citas, setCitas] = useState([]);
    const [hospitales, setHospitales] = useState([]);
    const [hospitalId, setHospitalId] = useState("");

    const fetchHospitales = async () => {
        try {
            const response = await fetch('/api/hospitales'); // Asegúrate de que este endpoint exista
            const data = await response.json();
            setHospitales(data);
        } catch (error) {
            console.error("Error fetching hospitales:", error);
        }
    };

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
        fetchHospitales();
    }, []);

    useEffect(() => {
        if (hospitalId) {
            fetchCitas(hospitalId);
        }
    }, [hospitalId]);

    return (
        <div>
            <header className="informes-citas-header">
                <img src={logoIMSS} alt="Logo IMSS" className="header-logo" />
                <h1 className="welcome-message">Bienvenido al Sistema de Gestión de Citas Médicas</h1>
                <h2 className="department-name">Departamento de Resonancia Magnética - HGR #46</h2>
            </header>
            <div>
                <select onChange={(e) => setHospitalId(e.target.value)}>
                    <option value="">Selecciona un hospital</option>
                    {hospitales.map(hospital => (
                        <option key={hospital.id} value={hospital.id}>
                            {hospital.nombre}
                        </option>
                    ))}
                </select>
                {citas.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre Completo</th>
                                <th>Fecha y Hora</th>
                                {/* Añade más encabezados según sea necesario */}
                            </tr>
                        </thead>
                        <tbody>
                            {citas.map(cita => (
                                <tr key={cita.id}>
                                    <td>{cita.nombre_completo}</td>
                                    <td>{cita.fecha_hora_estudio}</td>
                                    {/* Muestra más detalles de la cita aquí */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay citas disponibles para este hospital.</p>
                )}
            </div>
        </div>
    );
};

export default InformesMedicos;