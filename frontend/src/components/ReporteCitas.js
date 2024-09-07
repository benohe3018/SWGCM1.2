import React, { useState, useEffect } from "react";
import './ReporteCitas.css'; 
import logoIMSS from '../images/LogoIMSS.jpg';
import { getCitas } from './citasService'; // Asegúrate de que esta función esté definida
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReporteCitas = () => {
    const [citas, setCitas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('nombre_completo');

    useEffect(() => {
        const cargarCitas = async () => {
            try {
                setCargando(true);
                const data = await getCitas();
                console.log('Datos de citas:', data);
                setCitas(data);
            } catch (error) {
                console.error("Error al cargar citas:", error);
            } finally {
                setCargando(false);
            }
        };

        cargarCitas();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFieldChange = (event) => {
        setSearchField(event.target.value);
    };

    const filteredCitas = citas.filter((cita) => {
        if (searchField === 'nombre_completo') {
            return cita.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchField === 'nombre_completo_medico') {
            return cita.nombre_completo_medico.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchField === 'estudio_solicitado') {
            return cita.estudio_solicitado.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchField === 'hospital_envia') {
            return cita.hospital_envia.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return cita;
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Citas', 20, 10);
        doc.autoTable({
            head: [['Fecha y Hora', 'Paciente', 'Médico', 'Estudio', 'Hospital']],
            body: filteredCitas.map(cita => [
                cita.fecha_hora_estudio,
                cita.nombre_completo,
                cita.nombre_completo_medico,
                cita.estudio_solicitado,
                cita.hospital_envia
            ]),
        });
        doc.save('reporte_citas.pdf');
    };

    if (cargando) {
        return <div>Cargando citas...</div>;
    }

    return (
        <div className="reporte-citas-page">
            <header className="reporte-citas-header">
                <img src={logoIMSS} alt="Logo IMSS" className="citas-header-logo" />
                <h1>Reporte de Citas</h1>
            </header>
            <div className="busqueda-cita">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select value={searchField} onChange={handleFieldChange}>
                    <option value="nombre_completo">Paciente</option>
                    <option value="nombre_completo_medico">Médico</option>
                    <option value="estudio_solicitado">Estudio</option>
                    <option value="hospital_envia">Hospital</option>
                </select>
                <button onClick={generatePDF}>Generar PDF</button>
            </div>
            <div className="tabla-citas-container">
                <table className="tabla-citas">
                    <thead>
                        <tr>
                            <th>Fecha y Hora</th>
                            <th>Paciente</th>
                            <th>Médico</th>
                            <th>Estudio</th>
                            <th>Hospital</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCitas.map((cita) => (
                            <tr key={cita.id}>
                                <td>{cita.fecha_hora_estudio}</td>
                                <td>{cita.nombre_completo}</td>
                                <td>{cita.nombre_completo_medico}</td>
                                <td>{cita.estudio_solicitado}</td>
                                <td>{cita.hospital_envia}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReporteCitas;