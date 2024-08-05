from flask import Blueprint, request, jsonify
from ..models import DiagnosticoPresuntivo
from .. import db
from sqlalchemy.exc import SQLAlchemyError

diagnosticos_bp = Blueprint('diagnosticos', __name__)

@diagnosticos_bp.route('/diagnosticos', methods=['POST'])
def create_diagnostico():
    data = request.get_json()
    nombre_diagnostico = data.get('nombre_diagnostico')
    
    if not nombre_diagnostico:
        return jsonify({"error": "Nombre del diagnóstico es obligatorio"}), 400

    nuevo_diagnostico = DiagnosticoPresuntivo(nombre_diagnostico=nombre_diagnostico)
    
    try:
        db.session.add(nuevo_diagnostico)
        db.session.commit()
        return jsonify({"message": "Diagnóstico creado exitosamente"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@diagnosticos_bp.route('/diagnosticos', methods=['GET'])
def get_diagnosticos():
    try:
        diagnosticos = DiagnosticoPresuntivo.query.all()
        return jsonify([diagnostico.to_dict() for diagnostico in diagnosticos]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

@diagnosticos_bp.route('/diagnosticos/<int:id>', methods=['PUT'])
def update_diagnostico(id):
    data = request.get_json()
    diagnostico = DiagnosticoPresuntivo.query.get(id)
    
    if not diagnostico:
        return jsonify({"error": "Diagnóstico no encontrado"}), 404

    diagnostico.nombre_diagnostico = data.get('nombre_diagnostico', diagnostico.nombre_diagnostico)

    try:
        db.session.commit()
        return jsonify({"message": "Diagnóstico actualizado exitosamente"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@diagnosticos_bp.route('/diagnosticos/<int:id>', methods=['DELETE'])
def delete_diagnostico(id):
    diagnostico = DiagnosticoPresuntivo.query.get(id)
    
    if not diagnostico:
        return jsonify({"error": "Diagnóstico no encontrado"}), 404

    try:
        db.session.delete(diagnostico)
        db.session.commit()
        return jsonify({"message": "Diagnóstico eliminado exitosamente"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@diagnosticos_bp.route('/diagnosticos/list', methods=['GET'])
def get_diagnosticos():
    try:
        diagnosticos = DiagnosticoPresuntivo.query.all()
        return jsonify([{
            'id': diagnostico.id,
            'nombre_diagnostico': diagnostico.nombre_diagnostico
        } for diagnostico in diagnosticos]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

