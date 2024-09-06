import React, { useState, useEffect } from "react";
import './ReportesEspecialidades.css'; 
import logoIMSS from '../images/LogoIMSS.jpg';
import { getEspecialidades } from './especialidadesService'; // Asegúrate de que esta función esté definida
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportesEspecialidades = () => {
    const [especialidades, setEspecialidades] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const cargarEspecialidades = async () => {
            try {
                setCargando(true);
                const data = await getEspecialidades();
                setEspecialidades(data);
            } catch (error) {
                console.error("Error al cargar especialidades:", error);
            } finally {
                setCargando(false);
            }
        };

        cargarEspecialidades();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredEspecialidades = especialidades.filter((especialidad) => 
        especialidad.nombre_especialidad.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Especialidades Médicas', 20, 10);
        doc.autoTable({
            head: [['Nombre de la Especialidad']],
            body: filteredEspecialidades.map(especialidad => [
                especialidad.nombre_especialidad
            ]),
        });
        doc.save('reporte_especialidades.pdf');
    };

    if (cargando) {
        return <div>Cargando especialidades...</div>;
    }

    return (
        <div className="reportes-especialidades-page">
            <header className="reportes-especialidades-header">
                <img src={logoIMSS} alt="Logo IMSS" className="reportes-especialidades-header-logo" />
                <h1>Reporte de Especialidades Médicas</h1>
            </header>
            <div className="busqueda-especialidad">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button onClick={generatePDF}>Generar PDF</button>
            </div>
            <div className="tabla-especialidades-container">
                <table className="tabla-especialidades">
                    <thead>
                        <tr>
                            <th>Nombre de la Especialidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEspecialidades.map((especialidad) => (
                            <tr key={especialidad.id}>
                                <td>{especialidad.nombre_especialidad}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportesEspecialidades;