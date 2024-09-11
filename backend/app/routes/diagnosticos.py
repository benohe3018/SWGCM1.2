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
        return jsonify([{
            'id': diagnostico.id,
            'nombre_diagnostico': diagnostico.nombre_diagnostico
        } for diagnostico in diagnosticos]), 200
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
def get_diagnosticos_list():
    try:
        diagnosticos = DiagnosticoPresuntivo.query.all()
        return jsonify([{
            'id': diagnostico.id,
            'nombre_diagnostico': diagnostico.nombre_diagnostico
        } for diagnostico in diagnosticos]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

@diagnosticos_bp.route('/diagnosticos/restore', methods=['POST'])
def restore_diagnosticos():
  try:
      diagnosticos = request.get_json()
      for diagnostico_data in diagnosticos:
          existing_diagnostico = DiagnosticoPresuntivo.query.filter_by(id=diagnostico_data['id']).first()
          if existing_diagnostico:
              existing_diagnostico.nombre_diagnostico = diagnostico_data['nombre_diagnostico']
          else:
              nuevo_diagnostico = DiagnosticoPresuntivo(
                  nombre_diagnostico=diagnostico_data['nombre_diagnostico']
              )
              db.session.add(nuevo_diagnostico)
      db.session.commit()
      return jsonify({'message': 'Datos restaurados con éxito.'}), 200
  except Exception as e:
      return jsonify({'error': 'Error al restaurar los datos.'}), 500