import React, { useState, useEffect } from "react";
import './ReporteHospitales.css'; 
import logoIMSS from '../images/LogoIMSS.jpg';
import { getHospitales } from './hospitalesService'; // Asegúrate de que esta función esté definida
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReporteHospitales = () => {
    const [hospitales, setHospitales] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('nombre_hospital');

    useEffect(() => {
        const cargarHospitales = async () => {
            try {
                setCargando(true);
                const data = await getHospitales();
                setHospitales(data);
            } catch (error) {
                console.error("Error al cargar hospitales:", error);
            } finally {
                setCargando(false);
            }
        };

        cargarHospitales();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFieldChange = (event) => {
        setSearchField(event.target.value);
    };

    const filteredHospitales = hospitales.filter((hospital) => {
        if (searchField === 'nombre_hospital') {
            return hospital.nombre_hospital.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchField === 'ciudad_hospital') {
            return hospital.ciudad_hospital.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return hospital;
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Hospitales', 20, 10);
        doc.autoTable({
            head: [['Nombre del Hospital', 'Ciudad del Hospital']],
            body: filteredHospitales.map(hospital => [
                hospital.nombre_hospital,
                hospital.ciudad_hospital
            ]),
        });
        doc.save('reporte_hospitales.pdf');
    };

    if (cargando) {
        return <div>Cargando hospitales...</div>;
    }

    return (
        <div className="reporte-hospitales">
            <header className="reporte-hospitales__header">
                <img src={logoIMSS} alt="Logo IMSS" className="reporte-hospitales__logo" />
                <div className="reporte-hospitales__header-texts">
                    <h1 className="reporte-hospitales__welcome-message">Sistema de Gestión de Reportes Médicos</h1>
                    <h2 className="reporte-hospitales__department-name">Generar Informe de hospitales Registrados</h2>
                </div>
            </header>
            <div className="reporte-hospitales__busqueda">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="reporte-hospitales__busqueda-input"
                />
                <select value={searchField} onChange={handleFieldChange} className="reporte-hospitales__busqueda-select">
                    <option value="nombre_hospital">Nombre del Hospital</option>
                    <option value="ciudad_hospital">Ciudad del Hospital</option>
                </select>
                <button className="reporte-hospitales__pdf-button" onClick={generatePDF}>Imprimir Reporte en PDF</button>
            </div>
            <div className="reporte-hospitales__tabla-container">
                <table className="reporte-hospitales__tabla">
                    <thead>
                        <tr>
                            <th>Nombre del Hospital</th>
                            <th>Ciudad del Hospital</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHospitales.map((hospital) => (
                            <tr key={hospital.id}>
                                <td>{hospital.nombre_hospital}</td>
                                <td>{hospital.ciudad_hospital}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReporteHospitales;