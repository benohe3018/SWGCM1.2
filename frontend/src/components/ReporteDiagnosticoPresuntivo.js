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

    const filteredDiagnosticos = diagnosticos.filter((diagnostico) => 
        diagnostico.nombre_diagnostico.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <img src={logoIMSS} alt="Logo IMSS" className="diagnostico-presuntivo-header-logo" />
                <h1>Reporte de Diagnósticos Presuntivos</h1>
            </header>
            <div className="busqueda-diagnostico">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button onClick={generatePDF}>Generar PDF</button>
            </div>
            <div className="tabla-diagnosticos-container">
                <table className="tabla-diagnosticos">
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