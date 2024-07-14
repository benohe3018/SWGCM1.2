from flask import Blueprint, request, jsonify
from ..models import Cita
from ..models import PacientePrueba
from .. import db
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
import logging

citas_bp = Blueprint('citas', __name__)
pacientes_prueba_bp = Blueprint('pacientes_prueba', __name__)

@citas_bp.route('/citas', methods=['GET'])
def get_citas():
    try:
        citas = Cita.query.all()
        return jsonify([{
            'id_cita': cita.id_cita,
            'fecha_hora_cita': cita.fecha_hora_cita,
            'nss_paciente': cita.nss_paciente,
            'id_medico_refiere': cita.id_medico_refiere,
            'id_estudio_radiologico': cita.id_estudio_radiologico,
            'id_usuario_registra': cita.id_usuario_registra,
            'id_unidad_medica_origen': cita.id_unidad_medica_origen,
            'id_hospital_origen': cita.id_hospital_origen,
            'id_operador': cita.id_operador
        } for cita in citas]), 200
    except SQLAlchemyError as e:
        logging.error("Error al recuperar citas: %s", str(e))
        return jsonify({"error": "Error al recuperar citas"}), 500

@citas_bp.route('/citas', methods=['POST'])
def create_cita():
    data = request.get_json()
    logging.info("Datos recibidos: %s", data)
    if not all(k in data for k in ('fecha_hora_cita', 'nss_paciente', 'id_medico_refiere', 'id_estudio_radiologico', 'id_usuario_registra', 'id_unidad_medica_origen', 'id_hospital_origen', 'id_operador')):
        logging.error("Campos faltantes en la solicitud POST: %s", data)
        return jsonify({"error": "Faltan campos requeridos"}), 400
    
    try:
        new_cita = Cita(
            fecha_hora_cita=data['fecha_hora_cita'],
            nss_paciente=data['nss_paciente'],
            id_medico_refiere=data['id_medico_refiere'],
            id_estudio_radiologico=data['id_estudio_radiologico'],
            id_usuario_registra=data['id_usuario_registra'],
            id_unidad_medica_origen=data['id_unidad_medica_origen'],
            id_hospital_origen=data['id_hospital_origen'],
            id_operador=data['id_operador']
        )
        db.session.add(new_cita)
        db.session.commit()
        return jsonify({
            'id_cita': new_cita.id_cita,
            'fecha_hora_cita': new_cita.fecha_hora_cita,
            'nss_paciente': new_cita.nss_paciente,
            'id_medico_refiere': new_cita.id_medico_refiere,
            'id_estudio_radiologico': new_cita.id_estudio_radiologico,
            'id_usuario_registra': new_cita.id_usuario_registra,
            'id_unidad_medica_origen': new_cita.id_unidad_medica_origen,
            'id_hospital_origen': new_cita.id_hospital_origen,
            'id_operador': new_cita.id_operador
        }), 201
    except IntegrityError:
        db.session.rollback()
        logging.error("La cita ya existe: %s", data)
        return jsonify({"error": "La cita ya existe"}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error en la base de datos al crear cita: %s", str(e))
        return jsonify({"error": "Error en la base de datos"}), 500

@citas_bp.route('/citas/<int:id>', methods=['PUT'])
def update_cita(id):
    data = request.get_json()
    try:
        cita = Cita.query.get_or_404(id)
        cita.fecha_hora_cita = data.get('fecha_hora_cita', cita.fecha_hora_cita)
        cita.nss_paciente = data.get('nss_paciente', cita.nss_paciente)
        cita.id_medico_refiere = data.get('id_medico_refiere', cita.id_medico_refiere)
        cita.id_estudio_radiologico = data.get('id_estudio_radiologico', cita.id_estudio_radiologico)
        cita.id_usuario_registra = data.get('id_usuario_registra', cita.id_usuario_registra)
        cita.id_unidad_medica_origen = data.get('id_unidad_medica_origen', cita.id_unidad_medica_origen)
        cita.id_hospital_origen = data.get('id_hospital_origen', cita.id_hospital_origen)
        cita.id_operador = data.get('id_operador', cita.id_operador)
        db.session.commit()
        return jsonify({
            'id_cita': cita.id_cita,
            'fecha_hora_cita': cita.fecha_hora_cita,
            'nss_paciente': cita.nss_paciente,
            'id_medico_refiere': cita.id_medico_refiere,
            'id_estudio_radiologico': cita.id_estudio_radiologico,
            'id_usuario_registra': cita.id_usuario_registra,
            'id_unidad_medica_origen': cita.id_unidad_medica_origen,
            'id_hospital_origen': cita.id_hospital_origen,
            'id_operador': cita.id_operador
        }), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error al actualizar la cita: %s", str(e))
        return jsonify({"error": "Error al actualizar la cita"}), 500

@pacientes_prueba_bp.route('/pacientes_prueba/<int:id>', methods=['DELETE'])
def delete_paciente_prueba(id):
    print(f"Solicitud DELETE recibida para el ID: {id}")
    try:
        paciente = PacientePrueba.query.get(id)
        if not paciente:
            return jsonify({"error": "Paciente no encontrado"}), 404
            
        db.session.delete(paciente)
        db.session.commit()
        return jsonify({"message": "Paciente eliminado exitosamente"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error en la base de datos al eliminar paciente: %s", str(e))
        return jsonify({"error": "Error en la base de datos"}), 500

