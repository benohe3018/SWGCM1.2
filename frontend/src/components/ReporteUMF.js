import React, { useState, useEffect } from "react";
import './ReporteUMF.css'; 
import logoIMSS from '../images/LogoIMSS.jpg';
import { getUnidades } from './unidadesMedicinaFamiliarService'; // Asegúrate de que esta función esté definida
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReporteUMF = () => {
    const [unidades, setUnidades] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('nombre_unidad_medica');

    useEffect(() => {
        const cargarUnidades = async () => {
            try {
                setCargando(true);
                const data = await getUnidades();
                setUnidades(data);
            } catch (error) {
                console.error("Error al cargar unidades:", error);
            } finally {
                setCargando(false);
            }
        };

        cargarUnidades();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFieldChange = (event) => {
        setSearchField(event.target.value);
    };

    const filteredUnidades = unidades.filter((unidad) => {
        if (searchField === 'nombre_unidad_medica') {
            return unidad.nombre_unidad_medica.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchField === 'direccion_unidad_medica') {
            return unidad.direccion_unidad_medica.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return unidad;
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Unidades de Medicina Familiar', 20, 10);
        doc.autoTable({
            head: [['Nombre de la Unidad', 'Dirección de la Unidad']],
            body: filteredUnidades.map(unidad => [
                unidad.nombre_unidad_medica,
                unidad.direccion_unidad_medica
            ]),
        });
        doc.save('reporte_unidades.pdf');
    };

    if (cargando) {
        return <div>Cargando unidades...</div>;
    }

    return (
        <div className="reporte-umf">
            <header className="reporte-umf__header">
                <img src={logoIMSS} alt="Logo IMSS" className="reporte-umf__logo" />
                <div className="reporte-umf__header-texts">
                    <h1 className="reporte-umf__welcome-message">Sistema de Gestión de Reportes Médicos</h1>
                    <h2 className="reporte-umf__department-name">Generar Informe de Unidades de Medicina Familiar Registrados</h2>
                </div>
            </header>
    
            <div className="reporte-umf__busqueda">
                <div className="reporte-umf__busqueda-fila">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="reporte-umf__busqueda-input"
                    />
                    <select
                        value={searchField}
                        onChange={handleFieldChange}
                        className="reporte-umf__busqueda-select"
                    >
                        <option value="nombre_unidad_medica">Nombre de la Unidad</option>
                        <option value="direccion_unidad_medica">Dirección de la Unidad</option>
                    </select>
                </div>
                <button
                    className="reporte-umf__pdf-button"
                    onClick={generatePDF}
                >
                    Imprimir Reporte en PDF
                </button>
            </div>
    
            <div className="reporte-umf__tabla-container">
                <table className="reporte-umf__tabla">
                    <thead>
                        <tr>
                            <th>Nombre de la Unidad</th>
                            <th>Dirección de la Unidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUnidades.map((unidad) => (
                            <tr key={unidad.id_unidad_medica}>
                                <td>{unidad.nombre_unidad_medica}</td>
                                <td>{unidad.direccion_unidad_medica}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReporteUMF;