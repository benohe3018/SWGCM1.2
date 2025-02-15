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
    const [searchField, setSearchField] = useState('nombre_especialidad');

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

    const handleFieldChange = (event) => {
        setSearchField(event.target.value);
    };

    const filteredEspecialidades = especialidades.filter((especialidad) => {
        if (searchField === 'nombre_especialidad') {
            return especialidad.nombre_especialidad.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return especialidad;
    });

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
        <div className="reporte-especialidades">
            <header className="reporte-especialidades__header">
                <img src={logoIMSS} alt="Logo IMSS" className="reporte-especialidades__logo" />
                <div className="reporte-especialidades__header-texts">
                    <h1 className="reporte-especialidades__welcome-message">Sistema de Gestión de Reportes Médicos</h1>
                    <h2 className="reporte-especialidades__department-name">Generar Informe de Especialidades Registrados</h2>
                </div>
            </header>
    
            <div className="reporte-especialidades__busqueda">
                <div className="reporte-especialidades__busqueda-fila">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="reporte-especialidades__busqueda-input"
                    />
                    <select
                        value={searchField}
                        onChange={handleFieldChange}
                        className="reporte-especialidades__busqueda-select"
                    >
                        <option value="nombre_especialidad">Nombre de la Especialidad</option>
                    </select>
                </div>
                <button
                    className="reporte-especialidades__pdf-button"
                    onClick={generatePDF}
                >
                    Imprimir Reporte en PDF
                </button>
            </div>
    
            <div className="reporte-especialidades__tabla-container">
                <table className="reporte-especialidades__tabla">
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