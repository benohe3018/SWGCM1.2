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
    data = request.get_json()
    required_fields = ['fecha_hora_estudio', 'nss', 'nombre_paciente', 'apellido_paterno_paciente', 'apellido_materno_paciente', 'especialidad_medica', 'nombre_completo_medico', 'estudio_solicitado', 'unidad_medica_procedencia', 'diagnostico_presuntivo']
    
    for field in required_fields:
        if field not in data:
            logging.error("Campo faltante en la solicitud POST: %s", field)
            return jsonify({"error": f"Falta el campo requerido: {field}"}), 400
    
    key = os.getenv('ENCRYPTION_KEY').encode()
    
    try:
        fecha_hora_estudio = datetime.strptime(data['fecha_hora_estudio'], '%Y-%m-%dT%H:%M')
        encrypted_nss = encrypt_data(data['nss'], key)
        encrypted_nombre_paciente = encrypt_data(data['nombre_paciente'], key)
        encrypted_apellido_paterno_paciente = encrypt_data(data['apellido_paterno_paciente'], key)
        encrypted_apellido_materno_paciente = encrypt_data(data['apellido_materno_paciente'], key)
        encrypted_especialidad_medica = encrypt_data(data['especialidad_medica'], key)
        encrypted_nombre_completo_medico = encrypt_data(data['nombre_completo_medico'], key)
        encrypted_estudio_solicitado = encrypt_data(data['estudio_solicitado'], key)
        encrypted_unidad_medica_procedencia = encrypt_data(data['unidad_medica_procedencia'], key)
        encrypted_diagnostico_presuntivo = encrypt_data(data['diagnostico_presuntivo'], key)

        new_paciente_prueba = PacientePrueba(
            fecha_hora_estudio=fecha_hora_estudio,
            nss=encrypted_nss,
            nombre_paciente=encrypted_nombre_paciente,
            apellido_paterno_paciente=encrypted_apellido_paterno_paciente,
            apellido_materno_paciente=encrypted_apellido_materno_paciente,
            especialidad_medica=encrypted_especialidad_medica,
            nombre_completo_medico=encrypted_nombre_completo_medico,
            estudio_solicitado=encrypted_estudio_solicitado,
            unidad_medica_procedencia=encrypted_unidad_medica_procedencia,
            diagnostico_presuntivo=encrypted_diagnostico_presuntivo        
        )

        db.session.add(new_paciente_prueba)
        db.session.commit()

        return jsonify({"message": "Paciente prueba creado exitosamente"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error en la base de datos al crear paciente prueba: %s", str(e))
        return jsonify({"error": "Error en la base de datos"}), 500


