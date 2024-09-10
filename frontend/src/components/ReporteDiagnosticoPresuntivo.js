import React, { useState, useEffect } from "react";
import './ReporteDiagnosticoPresuntivo.css'; 
import logoIMSS from '../images/LogoIMSS.jpg';
import { getDiagnosticos } from './diagnosticosService'; // Asegúrate de que esta función esté definida
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReporteDiagnosticoPresuntivo = () => {
    const [diagnosticos, setDiagnosticos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('nombre_diagnostico');

    useEffect(() => {
        const cargarDiagnosticos = async () => {
            try {
                setCargando(true);
                const data = await getDiagnosticos();
                setDiagnosticos(data);
            } catch (error) {
                console.error("Error al cargar diagnósticos:", error);
            } finally {
                setCargando(false);
            }
        };

        cargarDiagnosticos();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFieldChange = (event) => {
        setSearchField(event.target.value);
    };

    const filteredDiagnosticos = diagnosticos.filter((diagnostico) => {
        if (searchField === 'nombre_diagnostico') {
            return diagnostico.nombre_diagnostico.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return diagnostico;
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Diagnósticos Presuntivos', 20, 10);
        doc.autoTable({
            head: [['Nombre del Diagnóstico']],
            body: filteredDiagnosticos.map(diagnostico => [
                diagnostico.nombre_diagnostico
            ]),
        });
        doc.save('reporte_diagnosticos.pdf');
    };

    if (cargando) {
        return <div>Cargando diagnósticos...</div>;
    }

    return (
        <div className="reporte-diagnostico-presuntivo-page">
            <header className="reporte-diagnostico-presuntivo-header">
                <img src={logoIMSS} alt="Logo IMSS" className="reporte-diagnostico-presuntivo-header-logo" />
                <div className="diagnostico-presuntivo-header-text">
                    <h1 className="welcome-reportes-Diagnosticos">Reporte de Estudios</h1>
                    <h2 className="departamento-reportes-Diagnosticos">Generar Informe de Diagnosticos Registrados</h2>
                </div>
            </header>
            <div className="reporte-busqueda-diagnostico">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select value={searchField} onChange={handleFieldChange}>
                    <option value="nombre_diagnostico">Nombre del Diagnóstico</option>
                </select>
            </div>
            <button className="reporte-diagnostico-presuntivo-boton" onClick={generatePDF}>Imprimir Reporte en PDF</button>
            <div className="tabla-reporte-diagnosticos-container">
                <table className="tabla-reporte-diagnosticos">
                    <thead>
                        <tr>
                            <th>Nombre del Diagnóstico</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDiagnosticos.map((diagnostico) => (
                            <tr key={diagnostico.id}>
                                <td>{diagnostico.nombre_diagnostico}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReporteDiagnosticoPresuntivo;