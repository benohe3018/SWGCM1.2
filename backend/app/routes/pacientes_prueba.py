from flask import Blueprint, request, jsonify
from ..models import PacientePrueba
from .. import db
from .encryption import encrypt_data
import os

pacientes_prueba_bp = Blueprint('pacientes_prueba', __name__)

@pacientes_prueba_bp.route('/pacientes_prueba', methods=['POST'])
def create_paciente_prueba():
    data = request.get_json()
    key = os.getenv('ENCRYPTION_KEY', 'mysecretkey12345').encode()

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
