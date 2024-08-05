# src/routes/especialidades.py

from flask import Blueprint, request, jsonify
from ..models import EspecialidadesMedicas
from .. import db
from sqlalchemy.exc import SQLAlchemyError

especialidades_bp = Blueprint('especialidades', __name__)

@especialidades_bp.route('/especialidades', methods=['POST'])
def create_especialidad():
    data = request.get_json()
    nombre_especialidad = data.get('nombre_especialidad')

    if not nombre_especialidad:
        return jsonify({"error": "El nombre de la especialidad es obligatorio"}), 400

    new_especialidad = EspecialidadesMedicas(nombre_especialidad=nombre_especialidad)

    try:
        db.session.add(new_especialidad)
        db.session.commit()
        return jsonify({"message": "Especialidad creada exitosamente"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@especialidades_bp.route('/especialidades/list', methods=['GET'])
def get_especialidades():
    try:
        especialidades = EspecialidadesMedicas.query.all()
        return jsonify([{
            'id': especialidad.id,
            'nombre_especialidad': especialidad.nombre_especialidad
        } for especialidad in especialidades]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

@especialidades_bp.route('/especialidades/<int:id>', methods=['PUT'])
def update_especialidad(id):
    data = request.get_json()
    especialidad = EspecialidadesMedicas.query.get(id)
    if not especialidad:
        return jsonify({"error": "Especialidad no encontrada"}), 404

    especialidad.nombre_especialidad = data.get('nombre_especialidad', especialidad.nombre_especialidad)

    try:
        db.session.commit()
        return jsonify({"message": "Especialidad actualizada exitosamente"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@especialidades_bp.route('/especialidades/<int:id>', methods=['DELETE'])
def delete_especialidad(id):
    especialidad = EspecialidadesMedicas.query.get(id)
    if not especialidad:
        return jsonify({"error": "Especialidad no encontrada"}), 404

    try:
        db.session.delete(especialidad)
        db.session.commit()
        return jsonify({"message": "Especialidad eliminada exitosamente"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
