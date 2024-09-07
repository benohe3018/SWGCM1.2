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
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [turno, setTurno] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const citasPerPage = 5;

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
        const fechaCita = new Date(cita.fecha_hora_estudio);
        const inicio = fechaInicio ? new Date(fechaInicio) : null;
        const fin = fechaFin ? new Date(fechaFin) : null;

        const matchesSearchField = searchField === 'nombre_completo'
            ? cita.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
            : searchField === 'nombre_completo_medico'
            ? cita.nombre_completo_medico.toLowerCase().includes(searchTerm.toLowerCase())
            : searchField === 'estudio_solicitado'
            ? cita.estudio_solicitado.toLowerCase().includes(searchTerm.toLowerCase())
            : searchField === 'hospital_envia'
            ? cita.hospital_envia.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

        const matchesDateRange = (!inicio || fechaCita >= inicio) && (!fin || fechaCita <= fin);

        const matchesTurno = () => {
            const horaCita = fechaCita.getHours() + fechaCita.getMinutes() / 60;
            if (turno === 'matutino') {
                return horaCita >= 6.5 && horaCita < 14;
            } else if (turno === 'vespertino') {
                return horaCita >= 14.01 && horaCita < 20.5;
            } else if (turno === 'nocturno') {
                return horaCita >= 20.51 || horaCita < 6.5;
            }
            return true; // Si no se selecciona ningún turno, mostrar todos
        };

        return matchesSearchField && matchesDateRange && matchesTurno();
    });

    // Calcular las citas a mostrar en la página actual
    const indexOfLastCita = currentPage * citasPerPage;
    const indexOfFirstCita = indexOfLastCita - citasPerPage;
    const currentCitas = filteredCitas.slice(indexOfFirstCita, indexOfLastCita);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                <h1 className="welcome-reportes-citas">Reporte de las Citas</h1>
                <h2 className="departamento-reportes-citas">Generar Informe de citas Registradas</h2>
            </header>
            <div className="busqueda-cita">
                <div className="fila">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    
                </div>
                <div className="fila">
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        placeholder="Fecha Inicio"
                    />
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        placeholder="Fecha Fin"
                    />
                </div>
                <div className="fila">
                    <select value={turno} onChange={(e) => setTurno(e.target.value)}>
                        <option value="">Turno</option>
                        <option value="">Todos los Turnos</option>
                        <option value="matutino">Matutino</option>
                        <option value="vespertino">Vespertino</option>
                        <option value="nocturno">Nocturno</option>
                    </select>
                    <select value={searchField} onChange={handleFieldChange}>
                        <option value="Seleccionar">Seleccionar</option>
                        <option value="nombre_completo">Paciente</option>
                        <option value="nombre_completo_medico">Médico</option>
                        <option value="estudio_solicitado">Estudio</option>
                        <option value="hospital_envia">Hospital</option>
                    </select>
                </div>
                <button className="generarPDF-Reporte-Citas" onClick={generatePDF}>Imprimir Reporte PDF</button>
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
                        {currentCitas.map((cita) => (
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
                <div className="pagination-reporte-citas">
                    {Array.from({ length: Math.ceil(filteredCitas.length / citasPerPage) }, (_, i) => (
                        <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReporteCitas;