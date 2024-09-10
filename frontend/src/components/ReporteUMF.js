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
        <div className="reporte-umf-page">
            <header className="reporte-umf-header">
                <img src={logoIMSS} alt="Logo IMSS" className="umf-header-logo" />
                <div className="umf-header-text">
                <h1 className="welcome-reporte-umf">Reporte de Unidades de Medicina Familiar</h1>
                <h2 className="departamento-reporte-umf">Generar Informe de Unidades de Medicina Familiar Registrados</h2>
                </div>
            </header>
            <div className="busqueda-unidad">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select value={searchField} onChange={handleFieldChange}>
                    <option value="nombre_unidad_medica">Nombre de la Unidad</option>
                    <option value="direccion_unidad_medica">Dirección de la Unidad</option>
                </select>
            </div>
            <button className="reporte-umf-boton" onClick={generatePDF}>Imprimir Reporte en PDF</button>
            <div className="tabla-reporte-unidades-container">
                <table className="tabla-reporte-unidades">
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