import React, { useState, useEffect } from "react";
import './ReporteEstudios.css'; 
import logoIMSS from '../images/LogoIMSS.jpg';
import { getEstudios } from './estudiosService'; // Asegúrate de que esta función esté definida
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReporteEstudios = () => {
    const [estudios, setEstudios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('nombre_estudio');

    useEffect(() => {
        const cargarEstudios = async () => {
            try {
                setCargando(true);
                const data = await getEstudios();
                setEstudios(data);
            } catch (error) {
                console.error("Error al cargar estudios:", error);
            } finally {
                setCargando(false);
            }
        };

        cargarEstudios();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFieldChange = (event) => {
        setSearchField(event.target.value);
    };

    const filteredEstudios = estudios.filter((estudio) => {
        if (searchField === 'nombre_estudio') {
            return estudio.nombre_estudio.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchField === 'descripcion_estudio') {
            return estudio.descripcion_estudio.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true; // Si no hay coincidencia, incluir el estudio
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Estudios Radiológicos', 20, 10);
        doc.autoTable({
            head: [['Nombre del Estudio', 'Descripción']],
            body: filteredEstudios.map(estudio => [
                estudio.nombre_estudio,
                estudio.descripcion_estudio
            ]),
        });
        doc.save('reporte_estudios.pdf');
    };

    if (cargando) {
        return <div>Cargando estudios...</div>;
    }

    return (
        <div className="reportes-estudios-page">
            <header className="reportes-estudios-header">
                <img src={logoIMSS} alt="Logo IMSS" className="reportes-estudios-header-logo" />
                <h1 className="welcome-reportes-estudios">Bienvenidos al modulo de Reportes</h1>
                <h2 className="departamento-reportes-estudios">Reportes de Estudios Radiológicos</h2>
            </header>
            <div className="busqueda-estudio">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select value={searchField} onChange={handleFieldChange}>
                    <option value="nombre_estudio">Nombre del Estudio</option>
                    <option value="descripcion_estudio">Descripción del Estudio</option>
                </select>
                <button className="reporte-estudios-radiologicos-boton" onClick={generatePDF}> Imprimir Reporte en PDF</button>
            </div>
            <div className="tabla-estudios-container">
                <table className="tabla-estudios">
                    <thead>
                        <tr>
                            <th>Nombre del Estudio</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEstudios.map((estudio) => (
                            <tr key={estudio.id_estudio}>
                                <td>{estudio.nombre_estudio}</td>
                                <td>{estudio.descripcion_estudio}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReporteEstudios;