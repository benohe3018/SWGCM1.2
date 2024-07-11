from flask import Blueprint, request, jsonify
from ..models import PacientePrueba
from .. import db
from .encryption import encrypt_data
from datetime import datetime
import os
from sqlalchemy.exc import SQLAlchemyError
import logging

pacientes_prueba_bp = Blueprint('pacientes_prueba', __name__)

@pacientes_prueba_bp.route('/pacientes_prueba', methods=['POST'])
def create_paciente_prueba():
    try:
        data = request.get_json()
        key = os.getenv('ENCRYPTION_KEY').encode()
        
        if not key:
            logging.error("Clave de encriptación no configurada.")
            return jsonify({"error": "Clave de encriptación no configurada."}), 500

        required_fields = [
            'fecha_hora_estudio', 'nss', 'nombre_paciente', 
            'apellido_paterno_paciente', 'apellido_materno_paciente', 
            'especialidad_medica', 'nombre_completo_medico', 
            'estudio_solicitado', 'unidad_medica_procedencia', 
            'diagnostico_presuntivo'
        ]
        
        if not all(field in data for field in required_fields):
            logging.error("Campos faltantes en la solicitud POST: %s", data)
            return jsonify({"error": "Faltan campos requeridos"}), 400

        fecha_hora_estudio = datetime.strptime(data['fecha_hora_estudio'], '%Y-%m-%dT%H:%M')
        encrypted_data = {field: encrypt_data(data[field], key.encode()) for field in required_fields if field != 'fecha_hora_estudio'}

        new_paciente_prueba = PacientePrueba(
            fecha_hora_estudio=fecha_hora_estudio,
            nss=encrypted_data['nss'],
            nombre_paciente=encrypted_data['nombre_paciente'],
            apellido_paterno_paciente=encrypted_data['apellido_paterno_paciente'],
            apellido_materno_paciente=encrypted_data['apellido_materno_paciente'],
            especialidad_medica=encrypted_data['especialidad_medica'],
            nombre_completo_medico=encrypted_data['nombre_completo_medico'],
            estudio_solicitado=encrypted_data['estudio_solicitado'],
            unidad_medica_procedencia=encrypted_data['unidad_medica_procedencia'],
            diagnostico_presuntivo=encrypted_data['diagnostico_presuntivo']        
        )

        db.session.add(new_paciente_prueba)
        db.session.commit()

        return jsonify({"message": "Paciente prueba creado exitosamente"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error en la base de datos al crear paciente prueba: %s", str(e))
        return jsonify({"error": "Error en la base de datos"}), 500
    except Exception as e:
        logging.error("Error inesperado al crear paciente prueba: %s", str(e))
        return jsonify({"error": "Error inesperado"}), 500

