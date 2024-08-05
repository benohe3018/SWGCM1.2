from flask import Blueprint, request, jsonify
from ..models import PacientePrueba, EspecialidadMedica, UnidadMedica, DiagnosticoPresuntivo
from .. import db
from .encryption import encrypt_data, decrypt_data, decrypt_data_old
from datetime import datetime
import os
from sqlalchemy.exc import SQLAlchemyError
import logging

especialidades_medicas_bp = Blueprint('especialidades_medicas', __name__)
unidades_medicas_bp = Blueprint('unidades_medicas', __name__)
diagnosticos_presuntivos_bp = Blueprint('diagnosticos_presuntivos', __name__)

@especialidades_medicas_bp.route('/especialidades_medicas/list', methods=['GET'])
def get_especialidades_medicas():
    try:
        especialidades = EspecialidadMedica.query.all()
        especialidades_list = [especialidad.nombre for especialidad in especialidades]
        return jsonify(especialidades_list), 200
    except SQLAlchemyError as e:
        logging.error("Error al recuperar especialidades médicas: %s", str(e))
        return jsonify({"error": "Error al recuperar especialidades médicas"}), 500

@unidades_medicas_bp.route('/unidades_medicas/list', methods=['GET'])
def get_unidades_medicas():
    try:
        unidades = UnidadMedica.query.all()
        unidades_list = [unidad.nombre for unidad in unidades]
        return jsonify(unidades_list), 200
    except SQLAlchemyError as e:
        logging.error("Error al recuperar unidades médicas: %s", str(e))
        return jsonify({"error": "Error al recuperar unidades médicas"}), 500

@diagnosticos_presuntivos_bp.route('/diagnosticos_presuntivos/list', methods=['GET'])
def get_diagnosticos_presuntivos():
    try:
        diagnosticos = DiagnosticoPresuntivo.query.all()
        diagnosticos_list = [diagnostico.nombre for diagnostico in diagnosticos]
        return jsonify(diagnosticos_list), 200
    except SQLAlchemyError as e:
        logging.error("Error al recuperar diagnósticos presuntivos: %s", str(e))
        return jsonify({"error": "Error al recuperar diagnósticos presuntivos"}), 500

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

@pacientes_prueba_bp.route('/pacientes_prueba', methods=['GET'])
def get_pacientes_prueba():
    key = os.getenv('ENCRYPTION_KEY').encode()
    try:
        pacientes_prueba = PacientePrueba.query.all()
        pacientes_list = []
        for paciente in pacientes_prueba:
            try:
                nombre_completo = f"{decrypt_data(paciente.nombre_paciente, key)} {decrypt_data(paciente.apellido_paterno_paciente, key)} {decrypt_data(paciente.apellido_materno_paciente, key)}"
                pacientes_list.append({
                    'id': paciente.id,
                    'fecha_hora_estudio': paciente.fecha_hora_estudio.strftime('%Y-%m-%dT%H:%M'),
                    'nombre_completo': nombre_completo,
                    'nss': decrypt_data(paciente.nss, key),
                    'especialidad_medica': decrypt_data(paciente.especialidad_medica, key),
                    'nombre_completo_medico': decrypt_data(paciente.nombre_completo_medico, key),
                    'estudio_solicitado': decrypt_data(paciente.estudio_solicitado, key),
                    'unidad_medica_procedencia': decrypt_data(paciente.unidad_medica_procedencia, key),
                    'diagnostico_presuntivo': decrypt_data(paciente.diagnostico_presuntivo, key)
                })
            except Exception as e:
                logging.error("Error al descifrar datos para el paciente con ID %s: %s", paciente.id, str(e))
                continue
        return jsonify(pacientes_list), 200
    except SQLAlchemyError as e:
        logging.error("Error al recuperar pacientes de prueba: %s", str(e))
        return jsonify({"error": "Error al recuperar pacientes de prueba"}), 500

@pacientes_prueba_bp.route('/pacientes_prueba/<int:id>', methods=['PUT'])
def update_paciente_prueba(id):
    data = request.get_json()
    logging.info(f"Datos recibidos para actualización: {data}")
    
    required_fields = [
        'fecha_hora_estudio', 'nss', 'nombre_paciente', 'apellido_paterno_paciente',
        'apellido_materno_paciente', 'especialidad_medica', 'nombre_completo_medico',
        'estudio_solicitado', 'unidad_medica_procedencia', 'diagnostico_presuntivo'
    ]
    
    for field in required_fields:
        if field not in data:
            logging.error(f"Campo faltante en la solicitud PUT: {field}")
            return jsonify({"error": f"Falta el campo requerido: {field}"}), 400

    key = os.getenv('ENCRYPTION_KEY').encode()
    
    try:
        paciente = PacientePrueba.query.get(id)
        if not paciente:
            return jsonify({"error": "Paciente no encontrado"}), 404
        
        paciente.fecha_hora_estudio = datetime.strptime(data['fecha_hora_estudio'], '%Y-%m-%dT%H:%M')
        paciente.nss = encrypt_data(data['nss'], key)
        paciente.nombre_paciente = encrypt_data(data['nombre_paciente'], key)
        paciente.apellido_paterno_paciente = encrypt_data(data['apellido_paterno_paciente'], key)
        paciente.apellido_materno_paciente = encrypt_data(data['apellido_materno_paciente'], key)
        paciente.especialidad_medica = encrypt_data(data['especialidad_medica'], key)
        paciente.nombre_completo_medico = encrypt_data(data['nombre_completo_medico'], key)
        paciente.estudio_solicitado = encrypt_data(data['estudio_solicitado'], key)
        paciente.unidad_medica_procedencia = encrypt_data(data['unidad_medica_procedencia'], key)
        paciente.diagnostico_presuntivo = encrypt_data(data['diagnostico_presuntivo'], key)

        db.session.commit()
        return jsonify({"message": "Paciente actualizado exitosamente"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error("Error en la base de datos al actualizar paciente: %s", str(e))
        return jsonify({"error": "Error en la base de datos"}), 500
    except Exception as e:
        logging.error("Error desconocido al actualizar paciente: %s", str(e))
        return jsonify({"error": "Error desconocido"}), 500

    
@pacientes_prueba_bp.route('/pacientes_prueba/<int:id>', methods=['DELETE'])
def delete_paciente_prueba(id):
    print(f"Recibida solicitud DELETE para paciente con ID: {id}")
    try:
        paciente = PacientePrueba.query.get(id)
        if not paciente:
            print(f"Paciente con ID {id} no encontrado")
            return jsonify({"error": "Paciente no encontrado"}), 404
        
        print(f"Eliminando paciente con ID: {id}")
        db.session.delete(paciente)
        db.session.commit()
        print(f"Paciente con ID {id} eliminado exitosamente")
        return jsonify({"message": "Paciente eliminado exitosamente"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        error_msg = f"Error en la base de datos al eliminar paciente: {str(e)}"
        print(error_msg)
        logging.error(error_msg)
        return jsonify({"error": "Error en la base de datos"}), 500







