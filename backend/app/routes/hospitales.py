from flask import Blueprint, request, jsonify
from ..models import Hospital
from .. import db
from sqlalchemy.exc import SQLAlchemyError

hospitales_bp = Blueprint('hospitales', __name__)

@hospitales_bp.route('/hospitales', methods=['POST'])
def create_hospital():
    data = request.get_json()
    nombre_hospital = data.get('nombre_hospital')
    ciudad_hospital = data.get('ciudad_hospital')

    if not nombre_hospital or not ciudad_hospital:
        return jsonify({"error": "Nombre y ciudad del hospital son obligatorios"}), 400

    new_hospital = Hospital(
        nombre_hospital=nombre_hospital,
        ciudad_hospital=ciudad_hospital
    )

    try:
        db.session.add(new_hospital)
        db.session.commit()
        return jsonify({"message": "Hospital creado exitosamente"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@hospitales_bp.route('/hospitales', methods=['GET'])
def get_hospitales():
    try:
        hospitales = Hospital.query.all()
        return jsonify([{
            'id': hospital.id,
            'nombre_hospital': hospital.nombre_hospital,
            'ciudad_hospital': hospital.ciudad_hospital
        } for hospital in hospitales]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

@hospitales_bp.route('/hospitales/<int:id>', methods=['PUT'])
def update_hospital(id):
    data = request.get_json()
    hospital = Hospital.query.get(id)
    if not hospital:
        return jsonify({"error": "Hospital no encontrado"}), 404

    hospital.nombre_hospital = data.get('nombre_hospital', hospital.nombre_hospital)
    hospital.ciudad_hospital = data.get('ciudad_hospital', hospital.ciudad_hospital)

    try:
        db.session.commit()
        return jsonify({"message": "Hospital actualizado exitosamente"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@hospitales_bp.route('/hospitales/<int:id>', methods=['DELETE'])
def delete_hospital(id):
    hospital = Hospital.query.get(id)
    if not hospital:
        return jsonify({"error": "Hospital no encontrado"}), 404

    try:
        db.session.delete(hospital)
        db.session.commit()
        return jsonify({"message": "Hospital eliminado exitosamente"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@hospitales_bp.route('/hospitales/restore', methods=['POST'])
def restore_hospitales():
    try:
        hospitales = request.get_json()
        for hospital_data in hospitales:
            existing_hospital = Hospital.query.filter_by(id=hospital_data['id']).first()
            if existing_hospital:
                existing_hospital.nombre_hospital = hospital_data['nombre_hospital']
                existing_hospital.direccion_hospital = hospital_data['direccion_hospital']
            else:
                nuevo_hospital = Hospital(
                    nombre_hospital=hospital_data['nombre_hospital'],
                    direccion_hospital=hospital_data['direccion_hospital']
                )
                db.session.add(nuevo_hospital)
        db.session.commit()
        return jsonify({'message': 'Datos restaurados con éxito.'}), 200
    except Exception as e:
        return jsonify({'error': 'Error al restaurar los datos.'}), 500
